import { Suspense } from "react";
import prisma from "@/lib/prisma";
import OverviewDashboard from "@/components/dashboard/OverviewDashboard";

export default async function OverviewPage() {
    // In a real app, read projectKey from user session/auth context
    // Here we just fetch the first project or mock data for MVP
    const project = await prisma.project.findFirst();

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <h1 className="text-2xl font-bold">No Project Found</h1>
                <p className="text-muted-foreground">Please configure a project first.</p>
            </div>
        );
    }

    // Fetch basic KPIs (Last 30 Days theoretically)
    // For MVP, we'll fetch totals or simulate them since the DB might be empty.
    // Using direct Prisma count to demonstrate real connection capabilities.
    const sessionsCount = await prisma.session.count({ where: { projectId: project.id } });
    const usersCount = await prisma.session.groupBy({ by: ['visitorId'], where: { projectId: project.id } }).then(res => res.length);
    const conversionsCount = await prisma.conversion.count({ where: { projectId: project.id } });
    const engagedCount = await prisma.session.count({ where: { projectId: project.id, engaged: true } });
    const singlePageViewCount = await prisma.session.count({
        where: {
            projectId: project.id,
            pageViews: { _count: { equals: 1 } },
            engaged: false
        }
    });

    const cvr = sessionsCount > 0 ? ((conversionsCount / sessionsCount) * 100).toFixed(1) : "0.0";
    const bounceRate = sessionsCount > 0 ? ((singlePageViewCount / sessionsCount) * 100).toFixed(1) : "0.0";
    const engagementRate = sessionsCount > 0 ? ((engagedCount / sessionsCount) * 100).toFixed(1) : "0.0";

    // If empty, generate some dummy data for the MVP presentation
    const isMock = sessionsCount === 0;

    const stats = {
        sessions: isMock ? 12543 : sessionsCount,
        users: isMock ? 9840 : usersCount,
        conversions: isMock ? 432 : conversionsCount,
        cvr: isMock ? "3.4" : cvr,
        bounceRate: isMock ? "45.2" : bounceRate,
        engagementRate: isMock ? "51.8" : engagementRate,
    };

    const trendData = [
        { name: "Mon", sessions: 400, conversions: 24, pv: 2400 },
        { name: "Tue", sessions: 300, conversions: 13, pv: 1398 },
        { name: "Wed", sessions: 520, conversions: 45, pv: 3800 },
        { name: "Thu", sessions: 470, conversions: 39, pv: 3908 },
        { name: "Fri", sessions: 650, conversions: 65, pv: 4800 },
        { name: "Sat", sessions: 700, conversions: 80, pv: 3800 },
        { name: "Sun", sessions: 620, conversions: 55, pv: 4300 },
    ];

    const channelData = [
        { channel: "Organic Search", sessions: 4532, cvr: "4.2%" },
        { channel: "Paid Search", sessions: 3210, cvr: "5.1%" },
        { channel: "Direct", sessions: 2100, cvr: "2.8%" },
        { channel: "Organic Social", sessions: 1540, cvr: "1.5%" },
        { channel: "Referral", sessions: 1161, cvr: "3.2%" },
    ];

    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <OverviewDashboard stats={stats} trendData={trendData} channelData={channelData} />
        </Suspense>
    );
}
