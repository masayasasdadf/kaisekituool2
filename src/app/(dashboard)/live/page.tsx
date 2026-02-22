"use client";

import { useEffect, useState } from "react";
import { useTerm } from "@/lib/terminology";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MousePointerClick, Eye, Target } from "lucide-react";

interface LiveEvent {
    id: string;
    type: string;
    url: string;
    timestamp: number;
    [key: string]: any;
}

export default function LiveEventsPage() {
    const { t } = useTerm();
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // In MVP, we hardcode an example project key or read from Context
        const projectKey = "mvp-project-123";
        const evtSource = new EventSource(`/api/live?projectKey=${projectKey}`);

        evtSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data && data.type) {
                    setEvents((prev) => {
                        const newEvents = [{ ...data, id: Math.random().toString(36).substr(2, 9) }, ...prev];
                        return newEvents.slice(0, 50); // Keep last 50
                    });
                }
            } catch (err) { }
        };

        evtSource.onopen = () => setIsConnected(true);
        evtSource.onerror = () => setIsConnected(false);

        return () => {
            evtSource.close();
        };
    }, []);

    const getEventIcon = (type: string) => {
        switch (type) {
            case "page_view": return <Eye className="w-4 h-4 text-blue-500" />;
            case "cta_click": return <MousePointerClick className="w-4 h-4 text-amber-500" />;
            case "conversion": return <Target className="w-4 h-4 text-green-500" />;
            default: return <Activity className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatTime = (ts: number) => {
        return new Date(ts).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Live Events</h2>
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {isConnected ? "Connected" : "Disconnected"}
                    </span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Real-time Stream</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground animate-pulse">
                                Listening for incoming events...
                            </div>
                        ) : (
                            events.map((evt) => (
                                <div key={evt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-background rounded-full shadow-sm">
                                            {getEventIcon(evt.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                {evt.type === "page_view" && "Page View"}
                                                {evt.type === "cta_click" && "Button Click"}
                                                {evt.type === "conversion" && (
                                                    <span className="text-green-600 font-bold">{t("Conversions")}: {evt.name}</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                {evt.url}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                                        {formatTime(evt.timestamp)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
