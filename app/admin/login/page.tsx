"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        sessionStorage.setItem('ss_admin_token', data.token)
        router.push('/admin/dashboard')
      } else {
        // Show actual error from server
        setError(data.error || 'Login failed. Please try again.')
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Red radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(204,0,0,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="glass-card p-10 w-full max-w-[400px] relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="text-[#CC0000] font-rajdhani font-bold text-3xl tracking-wide">SS</span>
          <span className="text-white font-rajdhani font-bold text-3xl tracking-wide">SELF DRIVE</span>
        </div>
        <p className="text-[#CC0000] text-sm font-inter text-center tracking-widest uppercase mb-8">Admin Access</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              autoComplete="off"
              required
              className="glass-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
              className="glass-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-red w-full mt-2">
            {loading ? "VERIFYING..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 font-inter text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
