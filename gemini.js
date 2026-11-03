// Gemini is called from the server only, so the API key never reaches the browser.
async function generateJSON(system, prompt) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const generationConfig = { temperature: 0.5, maxOutputTokens: 4096, responseMimeType: "application/json" };
  if (model.includes("flash")) generationConfig.thinkingConfig = { thinkingBudget: 0 };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig }),
  });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Gemini error:", res.status, body.error?.message);
    const msg = res.status === 429 ? "AI rate limit reached. Please wait a minute and try again."
      : res.status === 400 || res.status === 403 ? "AI request rejected. Check GEMINI_API_KEY and GEMINI_MODEL."
      : "The AI service had a problem. Please try again.";
    throw Object.assign(new Error(msg), { status: res.status === 429 ? 429 : 502 });
  }
  const text = (body.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
  try {
    return JSON.parse(text.replace(/^```(?:json)?|```$/g, "").trim());
  } catch {
    throw Object.assign(new Error("The AI gave an unreadable answer. Please try again."), { status: 502 });
  }
}

module.exports = { generateJSON };
