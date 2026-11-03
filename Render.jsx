const List = ({ items }) => (
  <ul className="list-disc space-y-1 pl-5">{(items || []).map((x, i) => <li key={i}>{x}</li>)}</ul>
);
const Sec = ({ title, children }) => (
  <div><h3 className="mb-1 font-semibold">{title}</h3>{children}</div>
);
const Chips = ({ items, cls }) => (
  <ul className="flex flex-wrap gap-2">
    {(items || []).map((x, i) => <li key={i} className={`rounded-full px-3 py-0.5 text-sm ${cls}`}>{x}</li>)}
  </ul>
);
const card = "rounded-lg border border-slate-200 p-4";

export default function Render({ kind, data }) {
  if (!data) return null;
  switch (kind) {
    case "resume":
      return (
        <div className="space-y-4">
          <p>{data.summary}</p>
          <Sec title="Strengths"><List items={data.strengths} /></Sec>
          <Sec title="Improvements"><List items={data.improvements} /></Sec>
          <Sec title="Suggested rewrites"><List items={data.rewriteSuggestions} /></Sec>
        </div>
      );
    case "ats": {
      const s = Number(data.score) || 0;
      const color = s >= 75 ? "text-green-600" : s >= 50 ? "text-amber-600" : "text-red-600";
      return (
        <div className="space-y-4">
          <p className={`text-5xl font-extrabold ${color}`}>{s}<span className="text-xl text-slate-400"> / 100</span></p>
          <Sec title="Matched keywords"><Chips items={data.matchedKeywords} cls="bg-green-100 text-green-800" /></Sec>
          <Sec title="Missing keywords"><Chips items={data.missingKeywords} cls="bg-red-100 text-red-800" /></Sec>
          <Sec title="Tips"><List items={data.tips} /></Sec>
        </div>
      );
    }
    case "interview":
      return (
        <ol className="space-y-3">
          {(data.questions || []).map((q, i) => (
            <li key={i} className={card}>
              <p className="font-medium">{i + 1}. {q.question} <span className="ml-1 rounded bg-violet-100 px-2 text-xs text-violet-800">{q.type}</span></p>
              <p className="mt-1 text-sm text-slate-600">Tip: {q.tip}</p>
            </li>
          ))}
        </ol>
      );
    case "roadmap":
      return (
        <ol className="space-y-3">
          {(data.phases || []).map((p, i) => (
            <li key={i} className={`${card} space-y-2`}>
              <p className="font-semibold">Phase {i + 1}: {p.title} <span className="text-sm font-normal text-slate-500">({p.duration})</span></p>
              <Sec title="Goals"><List items={p.goals} /></Sec>
              <Sec title="Resources"><List items={p.resources} /></Sec>
            </li>
          ))}
        </ol>
      );
    case "skillgap":
      return (
        <div className="space-y-4">
          <Sec title="Skills you already have"><Chips items={data.have} cls="bg-green-100 text-green-800" /></Sec>
          <Sec title="Skills to learn">
            <ul className="space-y-2">
              {(data.missing || []).map((m, i) => (
                <li key={i} className={card}>
                  <p className="font-medium">{m.skill} <span className="ml-1 rounded bg-amber-100 px-2 text-xs text-amber-800">{m.priority}</span></p>
                  <p className="text-sm text-slate-600">{m.why}</p>
                </li>
              ))}
            </ul>
          </Sec>
        </div>
      );
    case "jobs":
      return (
        <ul className="space-y-3">
          {(data.jobs || []).map((j, i) => (
            <li key={i} className={card}>
              <p className="font-semibold">{j.title} <span className="text-violet-700">{j.matchPercent}% match</span></p>
              <div className="my-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-violet-600" style={{ width: `${Math.min(100, Number(j.matchPercent) || 0)}%` }} /></div>
              <p className="text-sm text-slate-600">{j.why}</p>
              <p className="mt-1 text-sm">Next step: {j.nextStep}</p>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}
