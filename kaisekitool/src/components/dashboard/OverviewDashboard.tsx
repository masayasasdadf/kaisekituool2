"use client";

import { useTerm, MeasurementTerm } from "@/lib/terminology";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Users, Target, MousePointer2, Clock, ArrowRightCircle } from "lucide-react";

interface OverviewProps {
    stats: {
        sessions: number;
        users: number;
        conversions: number;
        cvr: string;
        bounceRate: string;
        engagementRate: string;
    };
    trendData: any[];
    channelData: any[];
}

export default function OverviewDashboard({ stats, trendData, channelData }: OverviewProps) {
    const { t, desc } = useTerm();

    const kpis = [
        { title: "Sessions", value: stats.sessions.toLocaleString(), icon: BarChart3, color: "text-blue-500" },
        { title: "Users", value: stats.users.toLocaleString(), icon: Users, color: "text-indigo-500" },
        { title: "Conversions", value: stats.conversions.toLocaleString(), icon: Target, color: "text-green-500" },
        { title: "CVR", value: `${stats.cvr}%`, icon: MousePointer2, color: "text-emerald-500" },
        { title: "Bounce Rate", value: `${stats.bounceRate}%`, icon: Clock, color: "text-amber-500" },
        { title: "Engagement Rate", value: `${stats.engagementRate}%`, icon: ArrowRightCircle, color: "text-purple-500" }
    ] as const;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <div className="text-sm text-muted-foreground">Last 30 Days</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kpis.map((kpi) => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Tooltip>
                                    <TooltipTrigger className="cursor-help border-b border-dashed border-muted-foreground/50">
                                        {t(kpi.title as MeasurementTerm)}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{desc(kpi.title as MeasurementTerm)}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </CardTitle>
                            <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t("Sessions")} & {t("Conversions")} Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                                />
                                <Line type="monotone" dataKey="sessions" name={t("Sessions")} stroke="#3b82f6" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="conversions" name={t("Conversions")} stroke="#22c55e" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top {t("Channel")}s</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {channelData.map((ch, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="font-medium text-sm">{ch.channel}</span>
                                    </div>
                                    <div className="flex space-x-6 text-sm">
                                        <span className="text-muted-foreground">{ch.sessions.toLocaleString()} {t("Sessions")}</span>
                                        <span className="font-medium text-emerald-600">{ch.cvr} {t("CVR")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
