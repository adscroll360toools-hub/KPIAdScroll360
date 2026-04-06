"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("tasks");

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role === "SUPER_ADMIN") {
      router.push("/super-admin");
    } else {
      fetchTasks();
    }
  }, [user]);

  const showNotification = (msg: string, type: "success" | "error") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

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
      showNotification("✅ Task assigned successfully!", "success");
      setTitle("");
      setDescription("");
      setAssignedToId("");
      fetchTasks();
    } catch (e: any) {
      showNotification(e.message || "❌ Failed to create task", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      await api.tasks.updateStatus(taskId, status);
      showNotification("✅ Task status updated!", "success");
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const canAssignTasks = user?.role === "COMPANY_ADMIN" || user?.role === "CONTROLLER";

  const navItems = [
    { id: "tasks", icon: "✅", label: "Tasks & Workflow" },
    { id: "standup", icon: "🎯", label: "Daily Standup" },
    { id: "skills", icon: "📈", label: "Skills & Growth" },
    ...(user?.role === "COMPANY_ADMIN" ? [{ id: "team", icon: "👥", label: "Team Management" }] : []),
    { id: "analytics", icon: "📊", label: "Analytics" },
  ];

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    PENDING: { bg: "rgba(234,179,8,0.1)", color: "#eab308", border: "rgba(234,179,8,0.3)" },
    IN_PROGRESS: { bg: "rgba(99,102,241,0.1)", color: "#818cf8", border: "rgba(99,102,241,0.3)" },
    COMPLETED: { bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.3)" },
  };

  if (!user || loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 60, height: 60,
            border: "3px solid rgba(99,102,241,0.3)",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#475569", fontSize: 14 }}>Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #020617; }

        .dashboard-root {
          min-height: 100vh;
          display: flex;
          background: #020617;
          font-family: 'Inter', sans-serif;
          color: #f1f5f9;
        }

        /* ---- SIDEBAR ---- */
        .sidebar {
          width: 260px;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          min-height: 100vh;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          backdrop-filter: blur(20px);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 24px;
        }

        .sidebar-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 16px;
          color: white;
          box-shadow: 0 0 16px rgba(99,102,241,0.4);
        }

        .sidebar-logo-text {
          font-size: 16px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-role {
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 700;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 0 8px;
          margin-bottom: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 2px;
          border: 1px solid transparent;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          color: #f1f5f9;
          background: rgba(255,255,255,0.04);
        }

        .nav-item.active {
          color: #a78bfa;
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.2);
        }

        .nav-item-icon { font-size: 16px; flex-shrink: 0; }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .user-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 8px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 2px;
        }

        .user-email { font-size: 12px; color: #475569; }

        .btn-logout {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid rgba(239,68,68,0.2);
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .btn-logout:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.4);
        }

        /* ---- MAIN CONTENT ---- */
        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 32px;
          min-height: 100vh;
          max-width: calc(100vw - 260px);
        }

        /* ---- HEADER ---- */
        .page-header {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          backdrop-filter: blur(10px);
        }

        .header-title { font-size: 24px; font-weight: 800; color: #f1f5f9; }
        .header-subtitle { font-size: 14px; color: #475569; margin-top: 2px; }

        .kpi-badge {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 16px;
          padding: 16px 24px;
          text-align: center;
        }

        .kpi-label { font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 1px; }
        .kpi-value { font-size: 32px; font-weight: 900; color: #10b981; line-height: 1.1; }

        /* ---- QUICK STATS ---- */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          background: rgba(99,102,241,0.05);
          border-color: rgba(99,102,241,0.2);
          transform: translateY(-2px);
        }

        .stat-card-icon {
          font-size: 24px;
          margin-bottom: 12px;
          display: block;
        }

        .stat-card-value {
          font-size: 28px;
          font-weight: 900;
          color: #f1f5f9;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-card-label {
          font-size: 12px;
          color: #475569;
          font-weight: 500;
        }

        /* ---- SECTIONS ---- */
        .section-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ---- FORM ---- */
        .task-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full { grid-column: 1 / -1; }

        .form-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

        .form-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.2s;
          width: 100%;
        }

        .form-input::placeholder { color: #334155; }

        .form-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .btn-submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          height: 100%;
          min-height: 44px;
        }

        .btn-submit:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ---- TASK CARDS ---- */
        .task-list { display: flex; flex-direction: column; gap: 12px; }

        .task-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          transition: all 0.3s ease;
          gap: 16px;
        }

        .task-card:hover {
          background: rgba(99,102,241,0.04);
          border-color: rgba(99,102,241,0.15);
          transform: translateX(4px);
        }

        .task-title { font-size: 15px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
        .task-desc { font-size: 13px; color: #475569; margin-bottom: 8px; }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .task-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #334155;
          background: rgba(255,255,255,0.04);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .task-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .status-badge {
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border: 1px solid;
          white-space: nowrap;
        }

        .btn-action {
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: #a78bfa;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }

        .btn-action:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }

        /* ---- EMPTY STATE ---- */
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          color: #334155;
        }

        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .empty-desc { font-size: 14px; }

        /* ---- NOTIFICATION ---- */
        .notification {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 1000;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          animation: slide-in 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .notification.success {
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          color: #10b981;
        }

        .notification.error {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          color: #ef4444;
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.msg}
        </div>
      )}

      <div className="dashboard-root">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">A</div>
            <div>
              <div className="sidebar-logo-text">AdScroll360</div>
              <div className="sidebar-role">{user.role.replace(/_/g, " ")}</div>
            </div>
          </div>

          <div className="nav-label">Navigation</div>
          <nav style={{ flex: 1 }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? "active" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <button className="btn-logout" onClick={logout}>
              <span>🚪</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main-content">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="header-title">Welcome back, {user.name} 👋</h1>
              <p className="header-subtitle">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="kpi-badge">
              <div className="kpi-label">Performance Score</div>
              <div className="kpi-value">94.2%</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            {[
              { icon: "📋", value: tasks.length, label: "Total Tasks" },
              { icon: "⏳", value: tasks.filter(t => t.status === "PENDING").length, label: "Pending" },
              { icon: "🔄", value: tasks.filter(t => t.status === "IN_PROGRESS").length, label: "In Progress" },
              { icon: "✅", value: tasks.filter(t => t.status === "COMPLETED").length, label: "Completed" },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <span className="stat-card-icon">{stat.icon}</span>
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Assign Task Form */}
          {canAssignTasks && (
            <div className="section-card">
              <div className="section-title">
                ➕ Assign New Task
              </div>
              <form onSubmit={createTask} className="task-form">
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Complete Q2 Report"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To (User ID / Email) *</label>
                  <input
                    required
                    type="text"
                    placeholder="user@company.com or UUID"
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    placeholder="Brief description of the task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? "⏳ Assigning..." : "🚀 Assign Task"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Task List */}
          <div className="section-card">
            <div className="section-title">
              📋 Your Tasks
              <span style={{
                marginLeft: "auto",
                background: "rgba(99,102,241,0.15)",
                color: "#a78bfa",
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 8,
                border: "1px solid rgba(99,102,241,0.2)",
              }}>
                {tasks.length} total
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-title">No tasks assigned yet</div>
                <div className="empty-desc">Tasks assigned to you will appear here.</div>
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => {
                  const sc = statusColors[task.status] || statusColors.PENDING;
                  return (
                    <div key={task.id} className="task-card">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="task-title">{task.title}</div>
                        {task.description && (
                          <div className="task-desc">{task.description}</div>
                        )}
                        <div className="task-meta">
                          {task.priority && (
                            <span className="task-meta-item">⚡ {task.priority}</span>
                          )}
                          <span className="task-meta-item">👤 {task.assignedToId?.slice(0, 8)}...</span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <span
                          className="status-badge"
                          style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                        >
                          {task.status.replace(/_/g, " ")}
                        </span>
                        {task.assignedToId === user.id && task.status !== "COMPLETED" && (
                          <button
                            className="btn-action"
                            onClick={() => updateStatus(task.id, task.status === "PENDING" ? "IN_PROGRESS" : "COMPLETED")}
                          >
                            {task.status === "PENDING" ? "▶ Start" : "✅ Complete"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
