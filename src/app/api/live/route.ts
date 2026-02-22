import { NextResponse } from 'next/server';
import { liveEventEmitter } from '@/lib/events';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Force dynamic for Server-Sent Events
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    // In a real scenario, protect this endpoint with NextAuth session check
    // and ensure the user has access to the requested project.
    const { searchParams } = new URL(req.url);
    const projectKey = searchParams.get('projectKey');

    if (!projectKey) {
        return NextResponse.json({ error: "Missing projectKey" }, { status: 400 });
    }

    // Create stream for SSE
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const sendEvent = (data: any) => {
                const payload = `data: ${JSON.stringify(data)}\n\n`;
                try {
                    controller.enqueue(encoder.encode(payload));
                } catch (e) {
                    // Stream might be closed
                    cleanUp();
                }
            };

            // Listen to the shared event emitter using the projectKey as channel
            const channel = `live-${projectKey}`;
            liveEventEmitter.on(channel, sendEvent);

            // Keep connection alive
            const keepAlive = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(': keepalive\n\n'));
                } catch (e) {
                    cleanUp();
                }
            }, 15000);

            const cleanUp = () => {
                clearInterval(keepAlive);
                liveEventEmitter.off(channel, sendEvent);
                try {
                    controller.close();
                } catch (e) { }
            };

            // Handle client disconnect
            req.signal.addEventListener('abort', cleanUp);
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}
