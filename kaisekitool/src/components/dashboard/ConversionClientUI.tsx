"use client";

import { useState } from "react";
import { useTerm } from "@/lib/terminology";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Link as LinkIcon, MousePointerClick, CheckCircle2 } from "lucide-react";

type Rule = {
    id: string;
    name: string;
    type: string;
    pattern: string;
};

export default function ConversionClientUI({ initialRules }: { initialRules: Rule[] }) {
    const { easyMode, t } = useTerm();
    const [rules, setRules] = useState<Rule[]>(initialRules);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("URL_MATCH");
    const [newPattern, setNewPattern] = useState("");

    const handleSave = async () => {
        // Simulated save to demonstrate UI flow
        const newRule: Rule = {
            id: Math.random().toString(36).substr(2, 9),
            name: newName,
            type: newType,
            pattern: newPattern
        };
        setRules([...rules, newRule]);
        setIsAdding(false);
        setNewName("");
        setNewPattern("");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("Conversions")} Settings</h2>
                    <p className="text-muted-foreground mt-1">
                        {easyMode
                            ? "サイトの目標（お問い合わせや購入など）を設定・管理します。"
                            : "Set up and manage your conversion tracking rules."}
                    </p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>
                            {easyMode ? "新しい成果（目標）を追加" : "Add Conversion Rule"}
                        </span>
                    </button>
                )}
            </div>

            {isAdding && (
                <Card className="border-primary">
                    <CardHeader>
                        <CardTitle>{easyMode ? "新しい成果を作る" : "Create Conversion Rule"}</CardTitle>
                        <CardDescription>
                            {easyMode
                                ? "どうなったら「成果」とするかの条件を選んでください。"
                                : "Define the trigger condition for this conversion."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {easyMode ? "成果の名前（例：資料請求完了）" : "Conversion Name"}
                                </label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded-md"
                                    placeholder={easyMode ? "例: お問い合わせ完了" : "e.g., Signup Complete"}
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    {easyMode ? "どんな時に成果とするか？" : "Trigger Type"}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setNewType("URL_MATCH")}
                                        className={`flex flex-col items-center p-4 border rounded-lg transition-all ${newType === "URL_MATCH" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"}`}
                                    >
                                        <LinkIcon className={`w-8 h-8 mb-2 ${newType === "URL_MATCH" ? "text-primary" : "text-muted-foreground"}`} />
                                        <span className="font-semibold">{easyMode ? "このページが表示されたら" : "URL Match"}</span>
                                        <span className="text-xs text-muted-foreground mt-1 text-center">
                                            {easyMode ? "特定のURL（サンクスページなど）を見たら達成" : "User visits a specific path or URL"}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setNewType("CLICK_SELECTOR")}
                                        className={`flex flex-col items-center p-4 border rounded-lg transition-all ${newType === "CLICK_SELECTOR" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"}`}
                                    >
                                        <MousePointerClick className={`w-8 h-8 mb-2 ${newType === "CLICK_SELECTOR" ? "text-primary" : "text-muted-foreground"}`} />
                                        <span className="font-semibold">{easyMode ? "このボタンが押されたら" : "Click Selector"}</span>
                                        <span className="text-xs text-muted-foreground mt-1 text-center">
                                            {easyMode ? "特定のボタンやリンクを押したら達成" : "User clicks element matching CSS selector"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {easyMode
                                        ? (newType === "URL_MATCH" ? "どのURLで成果としますか？" : "どの要素を押した時に成果としますか？")
                                        : (newType === "URL_MATCH" ? "Match Pattern (Path/Regex)" : "CSS Selector")}
                                </label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded-md"
                                    placeholder={newType === "URL_MATCH" ? "/checkout/thanks" : ".submit-btn"}
                                    value={newPattern}
                                    onChange={e => setNewPattern(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-4 py-2 border rounded-md hover:bg-muted"
                                >
                                    {easyMode ? "キャンセル" : "Cancel"}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    disabled={!newName || !newPattern}
                                >
                                    {easyMode ? "設定を保存する" : "Save Rule"}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rules.length === 0 && !isAdding && (
                    <div className="col-span-full p-8 text-center bg-muted/30 border border-dashed rounded-xl">
                        <p className="text-muted-foreground mb-4">
                            {easyMode ? "まだ成果設定がありません。" : "No conversion rules configured yet."}
                        </p>
                    </div>
                )}
                {rules.map((rule) => (
                    <Card key={rule.id}>
                        <CardHeader className="pb-3 border-b border-muted">
                            <div className="flex justify-between items-start">
                                <CardTitle>{rule.name}</CardTitle>
                                <span className="text-xs font-semibold px-2 py-1 bg-muted rounded">Active</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center space-x-2 text-sm">
                                {rule.type === "URL_MATCH" ? <LinkIcon className="w-4 h-4 text-primary" /> : <MousePointerClick className="w-4 h-4 text-primary" />}
                                <span className="font-medium text-muted-foreground">
                                    {easyMode
                                        ? (rule.type === "URL_MATCH" ? "表示条件" : "クリック条件")
                                        : (rule.type === "URL_MATCH" ? "URL Match" : "Click Selector")}
                                </span>
                            </div>
                            <div className="p-2 bg-muted rounded-md text-xs font-mono break-all text-secondary-foreground">
                                {rule.pattern}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
