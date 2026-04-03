"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default function SuperAdminDashboard() {
    const { user, token, logout } = useAuth();
    const router = useRouter();

    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [plan, setPlan] = useState("BASIC");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminName, setAdminName] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const fetchCompanies = async () => {
        try {
            const data = await api.companies.list();
            setCompanies(data.companies);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (user.role !== "SUPER_ADMIN") {
            router.push("/dashboard");
        } else {
            fetchCompanies();
        }
    }, [user]);

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.companies.create({ name, domain, plan, adminEmail, adminName, adminPassword });
            alert("Company created successfully!");
            fetchCompanies();
        } catch (e: any) {
            alert(e.message || "Error creating company");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
                <h2 className="text-xl font-bold tracking-tight text-blue-600 mb-8 mt-2 px-2">WorkHub Super Admin</h2>
                <nav className="flex-1 space-y-2">
                    <Button variant="secondary" className="w-full justify-start">Workspaces</Button>
                    <Button variant="ghost" className="w-full justify-start">Billing Stats</Button>
                </nav>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" onClick={logout}>
                    Sign Out
                </Button>
            </aside>

            <main className="flex-1 p-8 space-y-8">
                <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold">Platform Overview</h1>
                        <p className="text-gray-500">Manage all registered workspaces and tenants.</p>
                    </div>
                    <div className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Total Workspaces: {companies.length}
                    </div>
                </header>

                <section className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-bold mb-4">Create New Company</h2>
                    <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Company Name" required value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded" />
                        <input type="text" placeholder="Subdomain / Domain" value={domain} onChange={e => setDomain(e.target.value)} className="p-2 border rounded" />
                        <select value={plan} onChange={e => setPlan(e.target.value)} className="p-2 border rounded">
                            <option value="BASIC">Basic</option>
                            <option value="PRO">Pro</option>
                            <option value="ENTERPRISE">Enterprise</option>
                        </select>
                        <input type="text" placeholder="Admin Name" required value={adminName} onChange={e => setAdminName(e.target.value)} className="p-2 border rounded" />
                        <input type="email" placeholder="Admin Email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="p-2 border rounded" />
                        <input type="password" placeholder="Admin Password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="p-2 border rounded" />
                        <div className="md:col-span-2">
                            <Button type="submit">Create Workspace</Button>
                        </div>
                    </form>
                </section>

                <section className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-bold mb-4">Active Workspaces ({companies.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3 text-gray-600 font-semibold">Name</th>
                                    <th className="p-3 text-gray-600 font-semibold">Plan</th>
                                    <th className="p-3 text-gray-600 font-semibold">Users</th>
                                    <th className="p-3 text-gray-600 font-semibold">Tasks</th>
                                    <th className="p-3 text-gray-600 font-semibold">Joined At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map(c => (
                                    <tr key={c.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{c.name}</td>
                                        <td className="p-3"><span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">{c.plan}</span></td>
                                        <td className="p-3">{c._count?.users || 0}</td>
                                        <td className="p-3">{c._count?.tasks || 0}</td>
                                        <td className="p-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {companies.length === 0 && (
                                    <tr><td colSpan={5} className="p-4 text-center text-gray-500">No workspaces found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
