import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { determineChannelGroup } from '@/lib/attribution';
import { z } from 'zod';

const eventSchema = z.object({
    name: z.string(),
    properties: z.any().optional(),
    timestamp: z.number()
});

const payloadSchema = z.object({
    projectKey: z.string(),
    visitorId: z.string(),
    sessionId: z.string(),
    url: z.string(),
    title: z.string().optional(),
    events: z.array(eventSchema),
    timestamp: z.number()
});

import { liveEventEmitter } from '@/lib/events';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = payloadSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const { projectKey, visitorId, sessionId, events, url } = parsed.data;

        // Verify Project
        const project = await prisma.project.findUnique({
            where: { projectKey },
            include: { rules: true }
        });

        if (!project) {
            return NextResponse.json({ error: "Unauthorized project key" }, { status: 401 });
        }

        // Upsert Session
        let session = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        for (const evt of events) {
            if (evt.name === "session_start") {
                const props = evt.properties || {};
                const urlObj = new URL(url);
                const queryMatches = {
                    gclid: urlObj.searchParams.has('gclid'),
                    wbraid: urlObj.searchParams.has('wbraid'),
                    gbraid: urlObj.searchParams.has('gbraid'),
                    fbclid: urlObj.searchParams.has('fbclid'),
                };

                const channelGroup = determineChannelGroup(
                    props.source, props.medium, props.campaign, props.referrer, queryMatches
                );

                if (!session) {
                    session = await prisma.session.create({
                        data: {
                            id: sessionId,
                            sessionId,
                            visitorId,
                            projectId: project.id,
                            channelGroup,
                            campaign: props.campaign,
                            source: props.source,
                            medium: props.medium,
                            referrer: props.referrer,
                            landingPage: url
                        }
                    });
                }
            }

            // If somehow we receive generic events before session start, create a direct session fallback
            if (!session) {
                session = await prisma.session.create({
                    data: {
                        id: sessionId, sessionId, visitorId, projectId: project.id,
                        channelGroup: "Direct"
                    }
                });
            }

            // Process Event Mapping
            if (evt.name === "page_view") {
                await prisma.pageView.create({
                    data: {
                        projectId: project.id,
                        sessionId: session.id,
                        url: evt.properties?.url || url,
                        title: body.title
                    }
                });
            } else if (evt.name === "engagement_ping") {
                await prisma.session.update({
                    where: { id: session.id },
                    data: { engaged: true, duration: { increment: evt.properties?.duration || 10 }, lastActiveAt: new Date() }
                });
            } else if (evt.name === "scroll_depth") {
                // Update the most recent pageview for this session? Or just create an event.
                await prisma.event.create({
                    data: { projectId: project.id, sessionId: session.id, name: evt.name, url, properties: evt.properties }
                });
                // We consider high scroll depth as engagement
                if (evt.properties?.max && evt.properties.max >= 25) {
                    await prisma.session.update({ where: { id: session.id }, data: { engaged: true } });
                }
            } else if (evt.name === "cta_click") {
                await prisma.event.create({
                    data: { projectId: project.id, sessionId: session.id, name: evt.name, url, properties: evt.properties }
                });
                await prisma.session.update({ where: { id: session.id }, data: { engaged: true } });
            } else {
                await prisma.event.create({
                    data: { projectId: project.id, sessionId: session.id, name: evt.name, url, properties: evt.properties }
                });
            }

            // --- Conversion Rule Checking (Server-Side URL/Click matching) ---
            for (const rule of project.rules) {
                let isMatch = false;
                if (rule.type === "URL_MATCH" && evt.name === "page_view") {
                    const matchUrl = evt.properties?.url || url;
                    if (matchUrl.includes(rule.pattern)) isMatch = true;
                    // In real MVP, regex matching might apply here too
                } else if (rule.type === "CLICK_SELECTOR" && evt.name === "cta_click") {
                    if (evt.properties?.selector && evt.properties.selector === rule.pattern) isMatch = true;
                }

                if (isMatch) {
                    await prisma.conversion.create({
                        data: {
                            projectId: project.id,
                            sessionId: session.id,
                            ruleId: rule.id,
                            name: rule.name,
                            url
                        }
                    });
                    // Broadcast to SSE
                    liveEventEmitter.emit(`live-${projectKey}`, { type: 'conversion', name: rule.name, url, timestamp: Date.now() });
                }
            }

            // Broadcast Pageviews & Clicks to SSE
            if (['page_view', 'cta_click'].includes(evt.name)) {
                liveEventEmitter.emit(`live-${projectKey}`, { type: evt.name, properties: evt.properties, url, visitorId, timestamp: Date.now() });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Ingestion Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
