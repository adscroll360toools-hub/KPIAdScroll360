"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);

    const handleUpgrade = async (planType: string) => {
        setLoading(true);
        try {
            const data = await api.stripe.createCheckout(planType);
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            }
        } catch (e: any) {
            setStatusMsg(e.message || "Checkout failed");
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-5xl mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                <h1 className="text-xl font-bold">Billing & Upgrades</h1>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
            </div>

            {statusMsg && <div className="text-red-500 mb-4">{statusMsg}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold mb-2">Pro Plan</h2>
                    <p className="text-gray-500 mb-6">Scale your operations securely.</p>
                    <div className="text-4xl font-bold mb-4">$149<span className="text-lg font-normal text-gray-500">/mo</span></div>
                    <ul className="space-y-2 mb-8 text-gray-600">
                        <li>✓ Up to 25 Employees</li>
                        <li>✓ 3 Controller Assignments</li>
                        <li>✓ Full Reporting Access</li>
                    </ul>
                    <Button
                        className="w-full"
                        onClick={() => handleUpgrade("PRO")}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Upgrade to Pro"}
                    </Button>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold mb-2">Enterprise Plan</h2>
                    <p className="text-gray-500 mb-6">Unlimited power for large teams.</p>
                    <div className="text-4xl font-bold mb-4">Custom</div>
                    <ul className="space-y-2 mb-8 text-gray-600">
                        <li>✓ Unlimited Users & Roles</li>
                        <li>✓ Dedicated Account Manager</li>
                        <li>✓ Advanced Audit Logs</li>
                    </ul>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleUpgrade("ENTERPRISE")}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Contact Sales"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
