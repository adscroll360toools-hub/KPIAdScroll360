import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
      <header className="fixed top-0 w-full bg-white border-b px-6 py-4 flex justify-between items-center z-10">
        <div className="text-2xl font-bold tracking-tight text-blue-600">AdScroll360 WorkHub</div>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Scalable SaaS Workspace Management
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Manage your team, track performance, conduct daily standups, and deploy global rewards seamlessly from one multi-tenant dashboard.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-2">Basic Plan</h3>
            <p className="text-gray-500 mb-6">Perfect for small teams</p>
            <div className="text-4xl font-bold mb-6">$49<span className="text-lg font-normal text-gray-500">/mo</span></div>
            <ul className="text-left space-y-3 mb-8 text-gray-600 w-full">
              <li>✓ 5 Employees</li>
              <li>✓ 1 Admin</li>
              <li>✓ Core Tasks</li>
            </ul>
            <Button className="w-full mt-auto" variant="outline">Choose Basic</Button>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-xl shadow-md flex flex-col items-center transform scale-105">
            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
            <p className="text-blue-200 mb-6">For growing organizations</p>
            <div className="text-4xl font-bold mb-6">$149<span className="text-lg font-normal text-blue-200">/mo</span></div>
            <ul className="text-left space-y-3 mb-8 w-full">
              <li>✓ 25 Employees</li>
              <li>✓ 3 Controllers</li>
              <li>✓ Advanced Analytics</li>
            </ul>
            <Button className="w-full mt-auto bg-white text-blue-600 hover:bg-gray-100">Choose Pro</Button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-2">Enterprise Plan</h3>
            <p className="text-gray-500 mb-6">Unlimited scale & power</p>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="text-left space-y-3 mb-8 text-gray-600 w-full">
              <li>✓ Unlimited Users</li>
              <li>✓ Custom Branding</li>
              <li>✓ API Access</li>
            </ul>
            <Button className="w-full mt-auto" variant="outline">Contact Sales</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
