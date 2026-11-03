import { useEffect, useState } from "react";
import { api } from "../api.js";
import Feature from "../components/Feature.jsx";
import Render from "../components/Render.jsx";

const RESUME = { name: "resumeText", label: "Paste your resume text", rows: 8, required: true };
const SKILLS = { name: "skills", label: "Your skills (comma separated)", placeholder: "HTML, CSS, JavaScript, React" };

const FEATURES = {
  resume: { title: "AI Resume Review", fields: [RESUME] },
  ats: { title: "ATS Score Analysis", fields: [RESUME, { name: "jobDescription", label: "Paste the job description", rows: 6, required: true }] },
  interview: { title: "AI Interview Questions", fields: [{ name: "role", label: "Job role", placeholder: "Frontend Developer", required: true }, { name: "level", label: "Level", placeholder: "fresher / junior / senior" }] },
  roadmap: { title: "Career Roadmap Generator", fields: [{ name: "role", label: "Target role", placeholder: "Full-Stack Developer", required: true }, SKILLS, { name: "months", label: "Months available", placeholder: "6" }] },
  skillgap: { title: "Skill Gap Analysis", fields: [{ name: "role", label: "Target role", placeholder: "Backend Developer", required: true }, { ...SKILLS, required: true }] },
  jobs: { title: "Job Recommendations", fields: [{ ...SKILLS, required: true }, { name: "role", label: "Interested in (optional)", placeholder: "AI, web, data…" }] },
};
const TABS = [["overview", "Overview"], ["resume", "Resume"], ["ats", "ATS Score"], ["interview", "Interview"], ["roadmap", "Roadmap"], ["skillgap", "Skill Gap"], ["jobs", "Jobs"]];

function Overview({ onOpen }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(() => { api("/history").then(setItems).catch((e) => setError(e.message)); }, []);
  async function remove(id) {
    try { await api("/history/" + id, { method: "DELETE" }); setItems(items.filter((x) => x._id !== id)); if (open?._id === id) setOpen(null); } catch (e) { setError(e.message); }
  }

  if (error) return <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>;
  if (!items) return <p className="animate-pulse text-slate-500">Loading…</p>;

  const lastAts = items.find((x) => x.kind === "ats");
  const count = (k) => items.filter((x) => x.kind === k).length;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Latest ATS score</p><p className="text-4xl font-extrabold text-violet-700">{lastAts ? lastAts.data.score : "–"}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Analyses run</p><p className="text-4xl font-extrabold">{items.length}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Roadmaps / interviews</p><p className="text-4xl font-extrabold">{count("roadmap")} / {count("interview")}</p></div>
      </div>
      {items.length === 0 ? <p className="text-slate-500">Nothing yet. Start with the Resume or ATS Score tab.</p> : (
        <ul className="space-y-2">
          {items.map((x) => (
            <li key={x._id} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <span className="rounded bg-violet-100 px-2 text-xs font-medium uppercase text-violet-800">{x.kind}</span>
              <span className="flex-1 text-sm">{x.input} · {new Date(x.createdAt).toLocaleDateString()}</span>
              <button onClick={() => setOpen(open?._id === x._id ? null : x)} className="text-sm text-violet-700 underline">{open?._id === x._id ? "Hide" : "View"}</button>
              <button onClick={() => remove(x._id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      )}
      {open && <div className="rounded-xl border border-slate-200 bg-white p-5"><Render kind={open.kind} data={open.data} /></div>}
    </div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("overview");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="text-lg font-extrabold tracking-tight">AI Career Coach</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">Hi, {user.name}</span>
            <button onClick={onLogout} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:border-violet-600">Log out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm ${tab === id ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white hover:border-violet-600"}`}>{label}</button>
          ))}
        </nav>
        {tab === "overview" ? <Overview /> : <Feature key={tab} kind={tab} {...FEATURES[tab]} />}
      </main>
    </div>
  );
}
