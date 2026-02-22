import prisma from "@/lib/prisma";
import ConversionClientUI from "@/components/dashboard/ConversionClientUI";
import { Suspense } from "react";

export default async function ConversionsPage() {
    const project = await prisma.project.findFirst();

    let initialRules: any[] = [];
    if (project) {
        initialRules = await prisma.conversionRule.findMany({
            where: { projectId: project.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Pre-seed mock rules if empty
    if (initialRules.length === 0) {
        initialRules = [
            { id: "mock-1", name: "Purchased Plan A", type: "URL_MATCH", pattern: "/checkout/thanks" },
            { id: "mock-2", name: "Hero CTA Click", type: "CLICK_SELECTOR", pattern: "#btn-start-now" }
        ];
    }

    return (
        <Suspense fallback={<div>Loading conversions...</div>}>
            <ConversionClientUI initialRules={initialRules} />
        </Suspense>
    );
}
