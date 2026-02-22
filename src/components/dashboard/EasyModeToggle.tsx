"use client";

import { useTerm } from "@/lib/terminology";

export function EasyModeToggle() {
    const { easyMode, setEasyMode } = useTerm();

    return (
        <div className="flex items-center space-x-2 bg-muted p-1 rounded-full border border-border">
            <button
                onClick={() => setEasyMode(false)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${!easyMode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                通常モード
            </button>
            <button
                onClick={() => setEasyMode(true)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-semibold rounded-full transition-all ${easyMode ? "bg-green-100 text-green-800 shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                <span>🌱</span>
                <span>やさしいモード</span>
            </button>
        </div>
    );
}
