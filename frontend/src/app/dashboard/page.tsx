"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default function Dashboard() {
    const { user, token, logout } = useAuth();
    const router = useRouter();

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // New task form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedToId, setAssignedToId] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (user.role === "SUPER_ADMIN") {
            router.push("/super-admin");
        } else {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const data = await api.tasks.list();
            setTasks(data.tasks || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.tasks.create({ title, description, assignedToId });
            alert("Task configured successfully");
            setTitle("");
            setDescription("");
            setAssignedToId("");
            fetchTasks();
        } catch (e: any) {
            alert(e.message || "Failed to create task");
        } finally {
            setSubmitting(false); // One-click submit protection (Button is disabled during this)
        }
    };

    const updateStatus = async (taskId: string, status: string) => {
        try {
            await api.tasks.updateStatus(taskId, status);
            fetchTasks();
        } catch (e) {
            console.error(e);
        }
    };

    if (!user || loading) return <div className="p-10 text-center">Loading Workspace...</div>;

    const canAssignTasks = user.role === "COMPANY_ADMIN" || user.role === "CONTROLLER";

    return (
        <div className="min-h-screen flex bg-gray-50">
            <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
                <div className="mb-8 p-2">
                    <h2 className="text-xl font-bold tracking-tight text-blue-600">WorkHub</h2>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold bg-gray-100 p-1 rounded inline-block">
                        {user.role.replace('_', ' ')}
                    </div>
                </div>
                <nav className="flex-1 space-y-2">
                    <Button variant="secondary" className="w-full justify-start">Tasks & Workflow</Button>
                    <Button variant="ghost" className="w-full justify-start">Daily Standup</Button>
                    <Button variant="ghost" className="w-full justify-start">Skills & Growth</Button>
                    {user.role === 'COMPANY_ADMIN' && <Button variant="ghost" className="w-full justify-start mt-4 border-t pt-4 text-purple-600 hover:text-purple-700">Team Management</Button>}
                </nav>

                <div className="border-t pt-4 pb-2 text-sm text-gray-600">
                    {user.name} <br /> <span className="opacity-70 text-xs">{user.email}</span>
                </div>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" onClick={logout}> Sign Out </Button>
            </aside>

            <main className="flex-1 p-8 space-y-8 max-w-5xl">
                <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
                        <p className="text-gray-500">Here's your tasks overview for today.</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="text-center p-2 px-4 rounded-lg bg-green-50 border border-green-100">
                            <div className="text-xs text-green-700 font-semibold mb-1">Performance Mark</div>
                            <div className="text-xl font-bold text-green-600">94.2%</div>
                        </div>
                    </div>
                </header>

                {canAssignTasks && (
                    <section className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-bold mb-4">Assign New Task</h2>
                        <form onSubmit={createTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} className="col-span-2 p-2 border rounded" />
                            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-2 p-2 border rounded" />
                            <input required type="text" placeholder="Assign To (UUID/Email)" value={assignedToId} onChange={e => setAssignedToId(e.target.value)} className="p-2 border rounded" />
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Assigning..." : "Assign Task"}
                            </Button>
                        </form>
                    </section>
                )}

                <section className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-bold mb-4">Your Tasks</h2>
                    {tasks.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">No tasks found.</div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map(task => (
                                <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                                    <div>
                                        <h4 className="font-semibold text-lg">{task.title}</h4>
                                        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                                        <div className="text-xs mt-2 space-x-2 text-gray-400">
                                            <span>Priority: {task.priority}</span>
                                            <span>|</span>
                                            <span>Assigned To: {task.assignedToId}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                          ${task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : ''}
                          ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                       `}>
                                            {task.status.replace('_', ' ')}
                                        </span>

                                        {task.assignedToId === user.id && task.status !== 'COMPLETED' && (
                                            <Button size="sm" variant="outline" onClick={() => updateStatus(task.id, task.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED')}>
                                                Mark {task.status === 'PENDING' ? 'In Progress' : 'Completed'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
