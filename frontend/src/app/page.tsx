"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-6 transition-transform">
              W
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              WorkHub
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex text-slate-600 hover:text-blue-600">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 px-6 rounded-full font-semibold transition-all hover:scale-105 active:scale-95">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-50/50 blur-[120px] rounded-full -z-10 animate-pulse" />
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              NEW: PROJECT ANALYTICS 2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              The Operating System for <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">High Performance Teams</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Scale your SaaS operations with multi-tenant workspace management, automated KPIs, and global rewards deployment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg rounded-2xl shadow-xl shadow-blue-100 transition-all hover:-translate-y-1">
                  Start Your Workspace
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-slate-200 hover:bg-slate-50 transition-all">
                Book a Demo
              </Button>
            </div>

            {/* Dashboard Preview */}
            <div className="mt-20 relative max-w-5xl mx-auto perspective-1000">
               <div className="bg-slate-900 p-2 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800 rotate-x-2">
                  <div className="bg-white rounded-[1.5rem] p-1 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                      alt="WorkHub Dashboard" 
                      className="w-full h-auto rounded-xl opacity-90 transition-opacity hover:opacity-100"
                    />
                  </div>
               </div>
               {/* Decorative dots */}
               <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl" />
               <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-slate-100 bg-slate-50/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Active Users", value: "12k+" },
                { label: "Tasks Completed", value: "450k+" },
                { label: "Global Presence", value: "32+" },
                { label: "Satisfaction", value: "99.9%" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Flexible Plans for Every Scale</h2>
              <p className="text-slate-500 max-w-xl mx-auto">From early-stage startups to global enterprises, choose the partner that grows with you.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic */}
              <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-100 group">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Startup</h3>
                  <p className="text-slate-500 text-sm">Perfect for small teams finding their feet.</p>
                </div>
                <div className="mb-8">
                  <div className="text-5xl font-black text-slate-900 mb-1">$49</div>
                  <div className="text-sm font-medium text-slate-500 uppercase">per month</div>
                </div>
                <ul className="space-y-4 mb-10 text-slate-600">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>5 Employees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>1 Main Admin</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
                <Button className="w-full bg-white border-2 border-slate-200 text-slate-900 hover:border-blue-600 hover:bg-blue-50 h-14 rounded-2xl font-bold transition-all">Get Started</Button>
              </div>

              {/* Pro */}
              <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative transform md:scale-105 z-10 transition-transform hover:scale-110">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <p className="text-blue-100 text-sm opacity-80">Built for scaling organizations.</p>
                </div>
                <div className="mb-8">
                  <div className="text-5xl font-black mb-1">$149</div>
                  <div className="text-sm font-medium text-blue-100 uppercase">per month</div>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>25 Employees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>3 Unit Controllers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Priority Support</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 h-14 rounded-2xl font-bold transition-all shadow-xl">Level Up Now</Button>
              </div>

              {/* Enterprise */}
              <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-100 group">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Global</h3>
                  <p className="text-slate-500 text-sm">Custom solutions for massive scale.</p>
                </div>
                <div className="mb-8">
                  <div className="text-5xl font-black text-slate-900 mb-1">Custom</div>
                  <div className="text-sm font-medium text-slate-500 uppercase">contact sales</div>
                </div>
                <ul className="space-y-4 mb-10 text-slate-600">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Unlimited Users</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Full API Access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>SSO & Dedicated Support</span>
                  </li>
                </ul>
                <Button className="w-full bg-white border-2 border-slate-200 text-slate-900 hover:border-blue-600 hover:bg-blue-50 h-14 rounded-2xl font-bold transition-all">Talk to Us</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-20 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
              <span className="text-white text-xl font-bold">WorkHub</span>
            </div>
            <p className="max-w-sm mb-10">Powering high-growth companies with intelligent workspace automation and real-time team insights.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer inline-block" />
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer inline-block" />
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer inline-block" />
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Features</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">API Demo</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Integrations</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Updates</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Contact</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Privacy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
          <p>© {new Date().getFullYear()} AdScroll360 Inc. Built for winners.</p>
          <div className="flex gap-6">
            <span>Terms</span>
            <span>Policy</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
