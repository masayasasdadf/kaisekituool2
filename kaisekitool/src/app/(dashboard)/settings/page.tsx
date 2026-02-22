"use client";

import { useTerm } from "@/lib/terminology";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    const { easyMode } = useTerm();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground mt-1">
                    {easyMode ? "プロジェクトの設定や計測タグの確認ができます。" : "Configure project tracking keys, domains, and filters."}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Project Tracking Snippet</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {easyMode ? "以下のコードをサイトの<head>タグ内に貼り付けてください。" : "Copy and paste this snippet into the <head> of your website."}
                        </p>
                        <div className="bg-muted p-4 rounded-md font-mono text-sm border overflow-x-auto text-secondary-foreground">
                            {`<script src="https://your-domain.vercel.app/sdk.js" data-project="mvp-project-123"></script>`}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
