"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type MeasurementTerm =
    | "Sessions"
    | "Users"
    | "Conversions"
    | "CVR"
    | "Bounce Rate"
    | "Engagement Rate"
    | "Channel"
    | "Campaign"
    | "Landing Page"
    | "Scroll Depth"
    | "CTA Click"
    | "Funnel";

export const terminologyMapping: Record<MeasurementTerm, { normal: string; easy: string; descNormal: string; descEasy: string }> = {
    Sessions: { normal: "Sessions", easy: "訪問数", descNormal: "サイトが訪問された回数（セッション数）", descEasy: "サイトが見られた回数" },
    Users: { normal: "Users", easy: "訪問した人", descNormal: "対象期間内にサイトを訪問したユニークユーザー数", descEasy: "サイトを見てくれた人の数" },
    Conversions: { normal: "Conversions", easy: "成果数", descNormal: "設定されたコンバージョンが達成された回数", descEasy: "目標（購入や登録など）が達成された回数" },
    CVR: { normal: "CVR", easy: "成果率", descNormal: "セッションに対するコンバージョン率", descEasy: "サイトを見た人のうち、どれくらいが成果につながったか" },
    "Bounce Rate": { normal: "Bounce Rate", easy: "すぐ離脱した割合", descNormal: "1ページのみでエンゲージメントなく離脱したセッションの割合", descEasy: "サイトに来てすぐ帰ってしまった人の割合" },
    "Engagement Rate": { normal: "Engagement Rate", easy: "よく読まれた割合", descNormal: "エンゲージメントしたセッションの割合", descEasy: "サイトをしっかり読んでくれた人の割合" },
    Channel: { normal: "Channel", easy: "流入元", descNormal: "トラフィックの獲得チャネル", descEasy: "どこからサイトに来たか" },
    Campaign: { normal: "Campaign", easy: "広告キャンペーン", descNormal: "UTMパラメータのキャンペーン名", descEasy: "どの広告や企画で来たか" },
    "Landing Page": { normal: "Landing Page", easy: "最初に見られたページ", descNormal: "セッションが開始された最初のページパス", descEasy: "一番最初に見られたページ" },
    "Scroll Depth": { normal: "Scroll Depth", easy: "読了率", descNormal: "ページの最大スクロール到達深度", descEasy: "ページが下までどれくらい読まれたか" },
    "CTA Click": { normal: "CTA Click", easy: "ボタン押下数", descNormal: "主要なコールトゥアクションボタンのクリック数", descEasy: "重要なボタンが押された回数" },
    Funnel: { normal: "Funnel", easy: "成果までの流れ", descNormal: "コンバージョン達成に至る各ステップの通過率", descEasy: "ページを見てから成果がでるまでのステップ" }
};

interface TerminologyContextType {
    easyMode: boolean;
    setEasyMode: (mode: boolean) => void;
    t: (term: MeasurementTerm) => string;
    desc: (term: MeasurementTerm) => string;
}

const TerminologyContext = createContext<TerminologyContextType | undefined>(undefined);

export function TerminologyProvider({ children }: { children: React.ReactNode }) {
    const [easyMode, setEasyMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("kaiseki-easy-mode");
        if (saved) {
            setEasyMode(saved === "true");
        }
    }, []);

    const handleSetEasyMode = (mode: boolean) => {
        setEasyMode(mode);
        localStorage.setItem("kaiseki-easy-mode", mode.toString());
    };

    // Prevent hydration mismatch by returning raw strings on server, translated on client
    // But wait, it's a context so client components will just re-render.
    // We can just rely on the default (easyMode=false) for SSR, then effect updates it.

    const t = (term: MeasurementTerm) => {
        const entry = terminologyMapping[term];
        if (!entry) return term;
        return easyMode && mounted ? entry.easy : entry.normal;
    };

    const desc = (term: MeasurementTerm) => {
        const entry = terminologyMapping[term];
        if (!entry) return "";
        return easyMode && mounted ? entry.descEasy : entry.descNormal;
    };

    return (
        <TerminologyContext.Provider value={{ easyMode, setEasyMode: handleSetEasyMode, t, desc }}>
            {children}
        </TerminologyContext.Provider>
    );
}

export function useTerm() {
    const context = useContext(TerminologyContext);
    if (!context) {
        throw new Error("useTerm must be used within a TerminologyProvider");
    }
    return context;
}
