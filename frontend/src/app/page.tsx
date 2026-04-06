"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Particle component for background effects - only renders client-side to avoid hydration mismatch
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="particle" style={style} />;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [particles] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 1}px`,
      height: `${Math.random() * 4 + 1}px`,
      animationDuration: `${Math.random() * 20 + 10}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.6 + 0.1,
    }))
  );

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    setTimeout(() => setIsVisible(true), 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Real-time KPI Tracking",
      desc: "Monitor performance metrics that matter, updated in milliseconds.",
      color: "#6366f1",
    },
    {
      icon: "🌐",
      title: "Multi-tenant Architecture",
      desc: "Manage multiple companies with complete data isolation.",
      color: "#06b6d4",
    },
    {
      icon: "🎯",
      title: "Smart Task Assignment",
      desc: "AI-powered task routing to the right team members.",
      color: "#8b5cf6",
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      desc: "Deep insights with beautiful, interactive dashboards.",
      color: "#10b981",
    },
    {
      icon: "🏆",
      title: "Global Rewards Engine",
      desc: "Deploy incentives across your entire organization.",
      color: "#f59e0b",
    },
    {
      icon: "🔐",
      title: "Enterprise Security",
      desc: "SOC 2 compliant with role-based access control.",
      color: "#ef4444",
    },
  ];

  const stats = [
    { value: "12K+", label: "Active Users", icon: "👥" },
    { value: "450K+", label: "Tasks Done", icon: "✅" },
    { value: "99.9%", label: "Uptime SLA", icon: "🚀" },
    { value: "32+", label: "Countries", icon: "🌍" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO @ TechNova",
      text: "WorkHub transformed how we manage our 200-person team. The KPI tracking alone saved us 15 hours per week.",
      avatar: "SC",
      color: "#6366f1",
    },
    {
      name: "Marcus Johnson",
      role: "CEO @ GrowthLab",
      text: "The multi-tenant features are unmatched. We went from 3 companies to 20 with zero engineering overhead.",
      avatar: "MJ",
      color: "#06b6d4",
    },
    {
      name: "Priya Patel",
      role: "COO @ ScaleUp",
      text: "Finally, a platform that understands enterprise needs without the enterprise price tag.",
      avatar: "PP",
      color: "#8b5cf6",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #020617;
          color: #f1f5f9;
          overflow-x: hidden;
        }

        .landing-root {
          min-height: 100vh;
          background: #020617;
          position: relative;
        }

        /* ---- CURSOR GLOW ---- */
        .cursor-glow {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: left 0.1s ease, top 0.1s ease;
          mix-blend-mode: screen;
        }

        /* ---- PARTICLES ---- */
        .particles-container {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(99,102,241,0.6);
          animation: float linear infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(30px) rotate(360deg); opacity: 0; }
        }

        /* ---- GRID BACKGROUND ---- */
        .grid-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ---- NAVIGATION ---- */
        .nav {
          position: fixed;
          top: 0; width: 100%;
          z-index: 100;
          transition: all 0.4s ease;
        }

        .nav.scrolled {
          background: rgba(2,6,23,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.15);
          padding: 12px 0;
        }

        .nav:not(.scrolled) { padding: 20px 0; }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
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
          transition: transform 0.3s ease;
        }

        .logo:hover .logo-icon {
          transform: rotate(10deg) scale(1.1);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }

        .nav-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          position: relative;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .nav-links a:hover { color: #f1f5f9; }
        .nav-links a:hover::after { width: 100%; }

        .nav-cta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-ghost {
          color: #94a3b8;
          background: transparent;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }

        .btn-ghost:hover {
          color: #f1f5f9;
          background: rgba(255,255,255,0.05);
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.5);
        }

        .btn-primary:active { transform: translateY(0); }

        /* ---- HERO SECTION ---- */
        .hero {
          position: relative;
          z-index: 1;
          padding: 180px 24px 120px;
          text-align: center;
          max-width: 1280px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a78bfa;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 32px;
          text-transform: uppercase;
          animation: fadeInDown 0.8s ease forwards;
          opacity: 0;
        }

        .hero-badge-dot {
          width: 6px; height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: pulse-dot 2s ease infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.7); }
          50% { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
        }

        .hero-title {
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease 0.2s forwards;
          opacity: 0;
        }

        .hero-title .line1 { color: #f1f5f9; }

        .hero-title .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #a78bfa 40%, #06b6d4 80%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-subtitle {
          font-size: 20px;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.7;
          animation: fadeInUp 0.8s ease 0.4s forwards;
          opacity: 0;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease 0.6s forwards;
          opacity: 0;
        }

        .btn-hero-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          text-decoration: none;
          padding: 18px 40px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 8px 40px rgba(99,102,241,0.4);
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .btn-hero-primary::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          transform: rotate(45deg) translateX(-100%);
          transition: transform 0.6s ease;
        }

        .btn-hero-primary:hover::before {
          transform: rotate(45deg) translateX(100%);
        }

        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 60px rgba(99,102,241,0.6);
        }

        .btn-hero-outline {
          color: #94a3b8;
          text-decoration: none;
          padding: 18px 40px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 600;
          border: 1px solid rgba(148,163,184,0.2);
          background: rgba(255,255,255,0.02);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(10px);
        }

        .btn-hero-outline:hover {
          border-color: rgba(99,102,241,0.4);
          background: rgba(99,102,241,0.05);
          color: #f1f5f9;
          transform: translateY(-3px);
        }

        /* ---- HERO VISUAL ---- */
        .hero-visual {
          position: relative;
          margin: 80px auto 0;
          max-width: 900px;
          animation: fadeInUp 1s ease 0.8s forwards;
          opacity: 0;
        }

        .hero-visual-frame {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 24px;
          padding: 16px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.1),
            0 40px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .hero-visual-frame::before {
          content: '';
          position: absolute;
          top: 0; left: 25%; right: 25%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
        }

        .dashboard-mock {
          background: #0f172a;
          border-radius: 16px;
          overflow: hidden;
          min-height: 400px;
        }

        .mock-topbar {
          background: #1e293b;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mock-topbar-title {
          font-size: 14px;
          font-weight: 600;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mock-dot { width: 8px; height: 8px; border-radius: 50%; animation: pulse-dot 2s ease infinite; }
        .mock-dot.green { background: #10b981; }
        .mock-dot.blue { background: #6366f1; }

        .mock-body {
          display: grid;
          grid-template-columns: 200px 1fr;
          min-height: 360px;
        }

        .mock-sidebar {
          background: #0f172a;
          border-right: 1px solid rgba(255,255,255,0.05);
          padding: 20px 12px;
        }

        .mock-nav-item {
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 4px;
          cursor: default;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mock-nav-item.active {
          background: rgba(99,102,241,0.15);
          color: #a78bfa;
        }

        .mock-content {
          padding: 20px;
        }

        .mock-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .mock-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px;
        }

        .mock-stat-label { font-size: 11px; color: #475569; margin-bottom: 4px; }
        .mock-stat-value { font-size: 22px; font-weight: 800; }

        .mock-chart {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px;
          height: 160px;
          position: relative;
          overflow: hidden;
        }

        .mock-chart-label { font-size: 11px; color: #475569; margin-bottom: 12px; }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 100px;
        }

        .chart-bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          animation: grow-bar 1s ease forwards;
          transform-origin: bottom;
        }

        @keyframes grow-bar {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        /* ---- FLOATING BADGES ---- */
        .floating-badge {
          position: absolute;
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 12px;
          padding: 10px 16px;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: float-badge 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes float-badge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .floating-badge.left {
          top: 20%;
          left: -120px;
          animation-delay: 0s;
        }

        .floating-badge.right {
          top: 40%;
          right: -120px;
          animation-delay: 1.5s;
        }

        .floating-badge.bottom {
          bottom: 10%;
          left: 15%;
          animation-delay: 0.8s;
        }

        .badge-icon { font-size: 18px; }
        .badge-label { font-size: 11px; color: #64748b; }
        .badge-value { font-size: 16px; font-weight: 800; color: #f1f5f9; }

        /* ---- GLOW ORBS ---- */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .orb-purple {
          width: 600px; height: 600px;
          background: rgba(99,102,241,0.12);
          top: -200px; left: -100px;
          animation: orb-drift 15s ease-in-out infinite alternate;
        }

        .orb-cyan {
          width: 500px; height: 500px;
          background: rgba(6,182,212,0.08);
          bottom: -150px; right: -100px;
          animation: orb-drift 20s ease-in-out infinite alternate-reverse;
        }

        @keyframes orb-drift {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(60px) scale(1.1); }
        }

        /* ---- ANIMATIONS ---- */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ---- STATS SECTION ---- */
        .stats-section {
          position: relative;
          z-index: 1;
          padding: 80px 24px;
          background: rgba(255,255,255,0.01);
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          text-align: center;
        }

        .stat-item-icon { font-size: 28px; margin-bottom: 8px; }

        .stat-item-value {
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #f1f5f9, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-item-label {
          font-size: 13px;
          color: #475569;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ---- FEATURES SECTION ---- */
        .features-section {
          position: relative;
          z-index: 1;
          padding: 120px 24px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .section-label {
          display: inline-block;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: #6366f1;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 18px;
          color: #475569;
          max-width: 500px;
          line-height: 1.7;
          margin-bottom: 64px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.4s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--card-color, #6366f1), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover::before { opacity: 1; }

        .feature-card.active,
        .feature-card:hover {
          background: rgba(99,102,241,0.05);
          border-color: rgba(99,102,241,0.2);
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 40px;
          display: block;
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
        }

        /* ---- PRICING SECTION ---- */
        .pricing-section {
          position: relative;
          z-index: 1;
          padding: 120px 24px;
          text-align: center;
        }

        .pricing-grid {
          max-width: 1100px;
          margin: 64px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: center;
        }

        .pricing-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          text-align: left;
        }

        .pricing-card:hover {
          transform: translateY(-8px);
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.04);
        }

        .pricing-card.featured {
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
          border-color: rgba(99,102,241,0.4);
          transform: scale(1.05);
          box-shadow: 0 0 60px rgba(99,102,241,0.2);
        }

        .pricing-card.featured:hover {
          transform: scale(1.05) translateY(-8px);
        }

        .pricing-badge {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 5px 20px;
          border-radius: 0 0 12px 12px;
        }

        .pricing-plan {
          font-size: 14px;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .pricing-name {
          font-size: 24px;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 8px;
        }

        .pricing-desc {
          font-size: 14px;
          color: #475569;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 32px;
        }

        .price-currency {
          font-size: 20px;
          font-weight: 700;
          color: #94a3b8;
        }

        .price-value {
          font-size: 56px;
          font-weight: 900;
          color: #f1f5f9;
          line-height: 1;
        }

        .price-period {
          font-size: 14px;
          color: #475569;
        }

        .pricing-features {
          list-style: none;
          space-y: 12px;
          margin-bottom: 32px;
        }

        .pricing-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #94a3b8;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .feature-check {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(16,185,129,0.15);
          color: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }

        .btn-plan {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-plan-outline {
          background: transparent;
          border: 1px solid rgba(99,102,241,0.3);
          color: #6366f1;
        }

        .btn-plan-outline:hover {
          background: rgba(99,102,241,0.1);
          border-color: #6366f1;
        }

        .btn-plan-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
        }

        .btn-plan-primary:hover {
          box-shadow: 0 8px 40px rgba(99,102,241,0.6);
          transform: translateY(-2px);
        }

        /* ---- TESTIMONIALS ---- */
        .testimonials-section {
          position: relative;
          z-index: 1;
          padding: 120px 24px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 64px;
        }

        .testimonial-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.4s ease;
          position: relative;
        }

        .testimonial-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99,102,241,0.2);
          background: rgba(99,102,241,0.04);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .testimonial-quote {
          position: absolute;
          top: 24px; right: 24px;
          font-size: 48px;
          color: rgba(99,102,241,0.2);
          line-height: 1;
        }

        .testimonial-text {
          font-size: 15px;
          color: #94a3b8;
          line-height: 1.8;
          margin-bottom: 24px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testimonial-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
        }

        .testimonial-name {
          font-size: 14px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .testimonial-role {
          font-size: 12px;
          color: #475569;
        }

        /* ---- CTA SECTION ---- */
        .cta-section {
          position: relative;
          z-index: 1;
          padding: 120px 24px;
          text-align: center;
        }

        .cta-card {
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05));
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 32px;
          padding: 80px 60px;
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0; left: 25%; right: 25%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent);
        }

        .cta-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 400px; height: 400px;
          background: rgba(99,102,241,0.08);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .cta-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: #f1f5f9;
          letter-spacing: -1px;
          line-height: 1.1;
          margin-bottom: 16px;
          position: relative;
        }

        .cta-subtitle {
          font-size: 18px;
          color: #475569;
          margin-bottom: 40px;
          position: relative;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          position: relative;
        }

        /* ---- FOOTER ---- */
        .footer {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.01);
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 80px 24px 40px;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-brand-desc {
          font-size: 14px;
          color: #475569;
          line-height: 1.8;
          margin-top: 16px;
        }

        .footer-col-title {
          font-size: 13px;
          font-weight: 700;
          color: #f1f5f9;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          color: #475569;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-links a:hover { color: #6366f1; }

        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-bottom-text {
          font-size: 13px;
          color: #334155;
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-links a {
          color: #334155;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }

        .footer-bottom-links a:hover { color: #6366f1; }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 1100px) {
          .floating-badge.left, .floating-badge.right { display: none; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-inner { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .features-grid { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-card.featured { transform: none; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .footer-inner { grid-template-columns: 1fr; gap: 32px; }
          .cta-card { padding: 48px 24px; }
          .hero-title { letter-spacing: -1px; }
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.7); }
      `}</style>

      {/* Cursor Glow */}
      <div
        className="cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Grid Background */}
      <div className="grid-bg" />

      {/* Particles - only client-side to avoid hydration mismatch */}
      {mounted && (
        <div className="particles-container">
          {particles.map((p) => (
            <Particle
              key={p.id}
              style={{
                left: p.left,
                top: p.top,
                width: p.width,
                height: p.height,
                animationDuration: p.animationDuration,
                animationDelay: p.animationDelay,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* Glow Orbs */}
      <div className="glow-orb orb-purple" />
      <div className="glow-orb orb-cyan" />

      <div className="landing-root">
        {/* Navigation */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-inner">
            <Link href="/" className="logo">
              <div className="logo-icon">A</div>
              <span className="logo-text">AdScroll360</span>
            </Link>

            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonials">Reviews</a></li>
              <li><a href="#about">About</a></li>
            </ul>

            <div className="nav-cta">
              <Link href="/login" className="btn-ghost">Sign In</Link>
              <Link href="/login" className="btn-primary">
                <span>Get Started</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section ref={heroRef}>
          <div className="hero">
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              🚀 New: Advanced Analytics 2.0 — Live Now
            </div>

            <h1 className="hero-title">
              <span className="line1">The Command Center for</span>
              <br />
              <span className="gradient-text">High-Performance Teams</span>
            </h1>

            <p className="hero-subtitle">
              Unify your workforce, automate KPI tracking, and deploy global rewards — all from one intelligent, multi-tenant dashboard built for scale.
            </p>

            <div className="hero-actions">
              <Link href="/login" className="btn-hero-primary">
                ✨ Start Your Workspace
              </Link>
              <a href="#features" className="btn-hero-outline">
                🎯 See How It Works
              </a>
            </div>

            {/* Dashboard Visual */}
            <div className="hero-visual">
              <div className="hero-visual-frame">
                <div className="dashboard-mock">
                  <div className="mock-topbar">
                    <div className="mock-topbar-title">
                      <div className="mock-dot green" />
                      AdScroll360 WorkHub — Live Dashboard
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className="mock-dot blue" style={{ animationDelay: '1s' }} />
                      <span style={{ fontSize: 11, color: '#475569' }}>Real-time sync active</span>
                    </div>
                  </div>
                  <div className="mock-body">
                    <div className="mock-sidebar">
                      {['📊 Overview', '✅ Tasks', '👥 Team', '📈 Analytics', '🏆 Rewards', '⚙️ Settings'].map((item, i) => (
                        <div key={i} className={`mock-nav-item ${i === 0 ? 'active' : ''}`}>{item}</div>
                      ))}
                    </div>
                    <div className="mock-content">
                      <div className="mock-stat-grid">
                        {[
                          { label: 'Active Users', value: '2,847', color: '#6366f1' },
                          { label: 'Tasks Today', value: '143', color: '#10b981' },
                          { label: 'KPI Score', value: '94.2%', color: '#f59e0b' },
                        ].map((stat, i) => (
                          <div key={i} className="mock-stat-card">
                            <div className="mock-stat-label">{stat.label}</div>
                            <div className="mock-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mock-chart">
                        <div className="mock-chart-label">📈 Performance Trend — Last 7 Days</div>
                        <div className="chart-bars">
                          {[45, 65, 55, 80, 70, 90, 95].map((h, i) => (
                            <div
                              key={i}
                              className="chart-bar"
                              style={{
                                height: `${h}%`,
                                background: i === 6
                                  ? 'linear-gradient(180deg, #6366f1, #8b5cf6)'
                                  : 'rgba(99,102,241,0.3)',
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="floating-badge left">
                <span className="badge-icon">⚡</span>
                <div>
                  <div className="badge-label">Response Time</div>
                  <div className="badge-value">12ms</div>
                </div>
              </div>

              <div className="floating-badge right">
                <span className="badge-icon">🏆</span>
                <div>
                  <div className="badge-label">Team Score</div>
                  <div className="badge-value">94.2%</div>
                </div>
              </div>

              <div className="floating-badge bottom">
                <span className="badge-icon">🌍</span>
                <div>
                  <div className="badge-label">Global Presence</div>
                  <div className="badge-value">32 Countries</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="stat-item-icon">{stat.icon}</div>
                <div className="stat-item-value">{stat.value}</div>
                <div className="stat-item-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="features-section">
          <div className="section-label">Features</div>
          <h2 className="section-title">
            Everything your team<br />needs to succeed
          </h2>
          <p className="section-subtitle">
            Built for modern organizations that demand real-time insights, seamless collaboration, and measurable results.
          </p>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`feature-card ${activeFeature === i ? 'active' : ''}`}
                style={{ '--card-color': feature.color } as React.CSSProperties}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-desc">{feature.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="pricing-section">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="section-label" style={{ display: 'inline-block' }}>Pricing</div>
            <h2 className="section-title" style={{ marginTop: 8 }}>Simple, transparent pricing</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              No hidden fees. No surprises. Scale your plan as your team grows.
            </p>

            <div className="pricing-grid">
              {/* Starter */}
              <div className="pricing-card">
                <div className="pricing-plan">Starter</div>
                <div className="pricing-name">For small teams</div>
                <div className="pricing-desc">Perfect for startups finding their product-market fit.</div>
                <div className="pricing-price">
                  <span className="price-currency">$</span>
                  <span className="price-value">49</span>
                  <span className="price-period">/month</span>
                </div>
                <ul className="pricing-features">
                  {['5 Employees', '1 Admin Account', 'Core Task Management', 'Basic Analytics', 'Email Support'].map((f, i) => (
                    <li key={i} className="pricing-feature">
                      <span className="feature-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-plan btn-plan-outline">Get Started Free</Link>
              </div>

              {/* Pro */}
              <div className="pricing-card featured">
                <div className="pricing-badge">Most Popular</div>
                <div className="pricing-plan" style={{ color: '#a78bfa' }}>Enterprise</div>
                <div className="pricing-name">For scaling orgs</div>
                <div className="pricing-desc">The complete platform for growing companies with advanced needs.</div>
                <div className="pricing-price">
                  <span className="price-currency" style={{ color: '#a78bfa' }}>$</span>
                  <span className="price-value">149</span>
                  <span className="price-period">/month</span>
                </div>
                <ul className="pricing-features">
                  {['25 Employees', '3 Unit Controllers', 'Advanced Analytics', 'Global Rewards Engine', 'Priority 24/7 Support', 'Onboarding Wizard'].map((f, i) => (
                    <li key={i} className="pricing-feature">
                      <span className="feature-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-plan btn-plan-primary">Upgrade Now →</Link>
              </div>

              {/* Global */}
              <div className="pricing-card">
                <div className="pricing-plan">Global</div>
                <div className="pricing-name">Unlimited scale</div>
                <div className="pricing-desc">Custom infrastructure and white-glove support for massive organizations.</div>
                <div className="pricing-price">
                  <span className="price-value" style={{ fontSize: 40 }}>Custom</span>
                </div>
                <ul className="pricing-features">
                  {['Unlimited Users', 'Full API Access', 'SSO & SAML', 'Dedicated Account Manager', 'Custom Integrations', 'SLA Guarantee'].map((f, i) => (
                    <li key={i} className="pricing-feature">
                      <span className="feature-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-plan btn-plan-outline">Talk to Sales</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="testimonials-section">
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">Loved by high-performance teams</h2>
          <p className="section-subtitle">Join thousands of companies already transforming their operations with WorkHub.</p>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="about" className="cta-section">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2 className="cta-title">Ready to transform<br />your team's performance?</h2>
            <p className="cta-subtitle">Join 12,000+ companies already using AdScroll360 WorkHub to scale smarter.</p>
            <div className="cta-actions">
              <Link href="/login" className="btn-hero-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                ✨ Start Free Today
              </Link>
              <a href="#pricing" className="btn-hero-outline" style={{ fontSize: 16, padding: '14px 32px' }}>
                📊 View Pricing
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
                <div className="logo-icon">A</div>
                <span className="logo-text">AdScroll360</span>
              </Link>
              <p className="footer-brand-desc">
                Powering high-growth companies with intelligent workspace automation, real-time KPI tracking, and global rewards deployment.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Product</div>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#">API Docs</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-bottom-text">© {new Date().getFullYear()} AdScroll360 Inc. All rights reserved. Built for winners.</p>
            <div className="footer-bottom-links">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
