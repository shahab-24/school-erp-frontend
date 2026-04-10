// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // TODO: Implement registration API
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="card-bar" />

        <div className="form-header">
          <h1 className="form-title">Create Account</h1>
          <p className="form-sub">Sign up to get started</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Full Name</label>
            <input
              type="text"
              className="field-input"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Email Address</label>
            <input
              type="email"
              className="field-input"
              placeholder="admin@school.edu"
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-links">
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
