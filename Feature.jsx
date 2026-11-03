import { useState } from "react";
import { api } from "../api.js";
import Render from "./Render.jsx";

export default function Feature({ kind, title, fields }) {
  const [values, setValues] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      setData((await api("/coach/" + kind, { method: "POST", body: values })).data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const input = "mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 font-normal";
  return (
    <section className="space-y-5">
      <form onSubmit={run} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-extrabold">{title}</h2>
        {fields.map((f) => (
          <label key={f.name} className="block text-sm font-medium">
            {f.label}{f.required && " *"}
            {f.rows ? (
              <textarea className={input} rows={f.rows} placeholder={f.placeholder} value={values[f.name] || ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
            ) : (
              <input className={input} placeholder={f.placeholder} value={values[f.name] || ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
            )}
          </label>
        ))}
        <button disabled={loading} className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-50">
          {loading ? "Analysing…" : "Run analysis"}
        </button>
      </form>
      {loading && <p className="animate-pulse text-slate-500">The AI coach is working, this can take a few seconds…</p>}
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {data && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Render kind={kind} data={data} />
          <p className="mt-4 text-sm text-slate-500">Saved to your Overview history.</p>
        </div>
      )}
    </section>
  );
}
