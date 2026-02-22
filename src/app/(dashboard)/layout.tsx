import { Sidebar } from "@/components/dashboard/Sidebar";
import { EasyModeToggle } from "@/components/dashboard/EasyModeToggle";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-muted/40 min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 border-b bg-background flex items-center justify-end px-6 shadow-sm">
                    <EasyModeToggle />
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
