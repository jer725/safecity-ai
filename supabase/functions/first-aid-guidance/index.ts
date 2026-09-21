import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { description, language } = await req.json();

    if (!description || typeof description !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing 'description' field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");

    const languageInstruction = language === "TA"
      ? "Respond entirely in Tamil (தமிழ் மொழியில் பதிலளிக்கவும்). Every text value in the JSON below — title, summary, each action, and each caution — must be written in Tamil, not English."
      : "Respond entirely in English.";

    const systemPrompt = `You are a calm, careful first-aid guidance assistant for an emergency response app called SafeCity AI.
A citizen has described an emergency situation while waiting for an ambulance. Based on their description, give clear, safe, non-medical first-aid guidance.

${languageInstruction}

Respond ONLY in this exact JSON format, no extra text:
{
  "title": "Short title of the likely situation (e.g. 'Suspected Burn Injury')",
  "summary": "One sentence description of the situation",
  "actions": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "cautions": ["Do not X", "Do not Y", "Do not Z"]
}

Keep actions and cautions short, clear, and safe for a layperson to follow. Never suggest advanced medical procedures. If the description is unclear or not a medical emergency, say so gently in the summary and give general safety advice.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: description },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error:", errText);
      return new Response(
        JSON.stringify({ error: "AI service error", details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqData = await groqResponse.json();
    const aiContent = groqData.choices?.[0]?.message?.content;

    let parsedGuidance;
    try {
      parsedGuidance = JSON.parse(aiContent);
    } catch {
      return new Response(
        JSON.stringify({ error: "Could not parse AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsedGuidance), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});