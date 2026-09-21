import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CAMERA_MAP = [
  { number: "Camera 01", location: "Main Road" },
  { number: "Camera 02", location: "Bus Stand" },
  { number: "Camera 03", location: "Junction" },
  { number: "Camera 04", location: "Hospital Road" },
  { number: "Camera 05", location: "Railway Station" },
  { number: "Camera 06", location: "Market Area" },
  { number: "Camera 07", location: "Highway" },
  { number: "Camera 08", location: "Residential Area" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { requestText } = await req.json();

    if (!requestText || typeof requestText !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing 'requestText' field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");

    const systemPrompt = `You are an assistant for a city surveillance system called SafeCity AI. A government operator is submitting a request to pause AI incident detection on a specific CCTV camera, usually because of a known event like filming, a protest, roadwork, or a festival happening at that location.

Here is the mapping of camera numbers to their location names:
${CAMERA_MAP.map(c => `${c.number} = ${c.location}`).join("\n")}

The operator may refer to a camera by its number (e.g. "Camera 5", "camera 07") OR by its location name (e.g. "the Highway camera", "Junction"). Match either format to the correct location name from the mapping above.

Read the operator's message and identify:
1. Which camera location they mean (must be an EXACT match from the valid list above, or null if you cannot confidently determine one)
2. A short, clear reason for the suppression (a few words)
3. Whether you are confident in the camera match

Respond ONLY in this exact JSON format, no extra text:
{
  "camera": "exact matching location name from the valid list, or null",
  "reason": "short reason, a few words",
  "confident": true or false
}`;

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
          { role: "user", content: requestText },
        ],
        temperature: 0.2,
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

    let parsed;
    try {
      parsed = JSON.parse(aiContent);
    } catch {
      return new Response(
        JSON.stringify({ error: "Could not parse AI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
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
