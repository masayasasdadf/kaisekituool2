"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, MousePointerClick, Settings, Activity, Filter } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/overview", label: "Overview", icon: BarChart3 },
        { href: "/acquisition", label: "Acquisition", icon: Users },
        { href: "/behavior", label: "Behavior", icon: MousePointerClick },
        { href: "/conversions", label: "Conversions", icon: Filter },
        { href: "/live", label: "Live Events", icon: Activity },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="w-64 border-r bg-card h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    Kaiseki OS
                </span>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t text-xs text-muted-foreground">
                Kaiseki OS MVP v1.0
            </div>
        </div>
    );
}
