"use client";

import { useLoginMutation } from "@/lib/services/authApi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ email, password }).unwrap();

      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-6 border rounded-xl space-y-4 w-80">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
