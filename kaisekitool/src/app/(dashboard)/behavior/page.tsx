"use client";

import { useTerm } from "@/lib/terminology";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BehaviorPage() {
    const { easyMode, t, desc } = useTerm();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Behavior</h2>
                <p className="text-muted-foreground mt-1">
                    {easyMode ? "サイト内でユーザーがどう動いたか（スクロールやクリック）を確認できます。" : "View user engagement, scroll depth distributions, and top CTA clicks."}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("Landing Page")} & {t("Scroll Depth")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-12 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">
                            {easyMode ? "MVP版ではスクロール分布レポートは準備中です。" : "Behavior metrics (Scroll Depth distributions, CTA Top Lists) will be implemented in the next phase."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
