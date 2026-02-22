"use client";

import { useTerm } from "@/lib/terminology";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcquisitionPage() {
    const { easyMode, t, desc } = useTerm();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Acquisition</h2>
                <p className="text-muted-foreground mt-1">
                    {easyMode ? "どこからサイトに来たのか（広告、検索、SNSなど）を確認できます。" : "View traffic sources and UTM campaign performance."}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("Channel")} & {t("Campaign")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-12 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">
                            {easyMode ? "MVP版では概要ページでトップ流入元を確認できます。" : "Acquisition table (Channel x Campaign) will be implemented in the next phase. See Overview for top channels."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
