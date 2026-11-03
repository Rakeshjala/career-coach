import { useState } from "react";
import { api } from "../api.js";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      onLogin(await api("/auth/" + mode, { method: "POST", body: form }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const input = "mt-1 w-full rounded-lg border border-slate-300 p-2.5";
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">AI Career Coach</h1>
        <p className="text-sm text-slate-500">{mode === "login" ? "Log in to continue" : "Create your account"}</p>
        {mode === "register" && (
          <label className="block text-sm font-medium">Name<input name="name" value={form.name} onChange={set} className={input} required /></label>
        )}
        <label className="block text-sm font-medium">Email<input name="email" type="email" value={form.email} onChange={set} className={input} required /></label>
        <label className="block text-sm font-medium">Password<input name="password" type="password" value={form.password} onChange={set} className={input} required minLength={6} /></label>
        {error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-violet-600 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-60">
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="w-full text-sm text-violet-700 hover:underline">
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
