"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/services/api";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.login({ email, password });
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #020617;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .grid-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .orb-left {
          position: fixed;
          width: 600px; height: 600px;
          background: rgba(99,102,241,0.1);
          border-radius: 50%;
          filter: blur(100px);
          top: -200px; left: -200px;
          pointer-events: none;
        }

        .orb-right {
          position: fixed;
          width: 500px; height: 500px;
          background: rgba(139,92,246,0.08);
          border-radius: 50%;
          filter: blur(100px);
          bottom: -150px; right: -150px;
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          max-width: 440px;
          backdrop-filter: blur(20px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
          animation: fade-up 0.6s ease forwards;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 25%; right: 25%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .login-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 18px;
          color: white;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }

        .login-logo-text {
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-title {
          font-size: 28px;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 6px;
          margin-top: 24px;
        }

        .login-subtitle { font-size: 14px; color: #475569; margin-bottom: 32px; }

        .form-group { margin-bottom: 18px; }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .input-wrapper { position: relative; }

        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.2s;
        }

        .form-input::placeholder { color: #334155; }

        .form-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .form-input.pr { padding-right: 48px; }

        .eye-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          transition: color 0.2s;
        }

        .eye-toggle:hover { color: #a78bfa; }

        .error-box {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          transform: rotate(45deg) translateX(-100%);
          transition: transform 0.6s ease;
        }

        .btn-submit:hover::before { transform: rotate(45deg) translateX(100%); }

        .btn-submit:hover:not(:disabled) {
          box-shadow: 0 8px 40px rgba(99,102,241,0.5);
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-footer {
          text-align: center;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .login-footer-text { font-size: 13px; color: #334155; }
        .login-footer-link { color: #818cf8; text-decoration: none; font-weight: 600; }
        .login-footer-link:hover { color: #a78bfa; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="grid-bg" />
      <div className="orb-left" />
      <div className="orb-right" />

      <div className="login-root">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">A</div>
            <span className="login-logo-text">AdScroll360</span>
          </div>

          <h1 className="login-title">Welcome back 👋</h1>
          <p className="login-subtitle">Sign in to your workspace to continue.</p>

          {error && (
            <div className="error-box">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input pr"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" />
                  Signing in...
                </>
              ) : (
                <>✨ Sign In to Workspace</>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{" "}
              <Link href="/#pricing" className="login-footer-link">View Plans →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
