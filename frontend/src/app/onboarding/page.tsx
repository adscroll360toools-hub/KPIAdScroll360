"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Add First Employee
    const [empName, setEmpName] = useState("");
    const [empEmail, setEmpEmail] = useState("");
    const [empPassword, setEmpPassword] = useState("");

    // Step 2: Assign Task
    const [taskTitle, setTaskTitle] = useState("Setup workspace profile");
    const [createdEmpId, setCreatedEmpId] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (user.role !== "COMPANY_ADMIN") {
            router.push("/dashboard");
        }
    }, [user]);

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.users.create({
                name: empName,
                email: empEmail,
                password: empPassword,
                role: "EMPLOYEE"
            });
            setCreatedEmpId(data.user.id);
            setStep(2);
        } catch (e: any) {
            alert(e.message || "Failed to create employee (Limit reached or error)");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.tasks.create({
                title: taskTitle,
                description: "Please update your profile details and confirm settings.",
                assignedToId: createdEmpId
            });
            setStep(3);
        } catch (e: any) {
            alert(e.message || "Failed to assign task");
            setStep(3); // push to end anyway
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow border">

                <div className="mb-8 flex justify-between items-center text-sm font-medium text-gray-500">
                    <div className={step >= 1 ? "text-blue-600" : ""}>1. First Employee</div>
                    <div className="flex-1 border-t border-gray-200 mx-4"></div>
                    <div className={step >= 2 ? "text-blue-600" : ""}>2. First Task</div>
                    <div className="flex-1 border-t border-gray-200 mx-4"></div>
                    <div className={step === 3 ? "text-blue-600" : ""}>3. Done!</div>
                </div>

                {step === 1 && (
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome to AdScroll360 WorkHub</h1>
                        <p className="text-gray-500 mb-8">Let's set up your team by adding your first employee to the workspace.</p>

                        <form onSubmit={handleAddEmployee} className="space-y-4">
                            <input required type="text" placeholder="Employee Name" value={empName} onChange={e => setEmpName(e.target.value)} className="w-full p-3 border rounded focus:outline-blue-500" />
                            <input required type="email" placeholder="Employee Email" value={empEmail} onChange={e => setEmpEmail(e.target.value)} className="w-full p-3 border rounded focus:outline-blue-500" />
                            <input required type="password" placeholder="Temporary Password" value={empPassword} onChange={e => setEmpPassword(e.target.value)} className="w-full p-3 border rounded focus:outline-blue-500" />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Adding..." : "Add Employee & Continue"}
                            </Button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Assign First Task</h1>
                        <p className="text-gray-500 mb-8">Now let's verify the workflow by assigning the new employee a task.</p>

                        <form onSubmit={handleAssignTask} className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Task Title</label>
                            <input required type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full p-3 border rounded focus:outline-blue-500" />

                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? "Assigning..." : "Assign Task & Finish"}
                            </Button>
                            <Button variant="ghost" type="button" className="w-full mt-2" onClick={() => setStep(3)}>Skip for now</Button>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4 text-green-600">You're all set!</h1>
                        <p className="text-gray-500 mb-8">Your workspace is configured and ready to scale.</p>
                        <Button size="lg" className="px-10" onClick={() => router.push("/dashboard")}>
                            Go to Dashboard
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
