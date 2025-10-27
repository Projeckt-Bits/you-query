export async function POST(req) {
  try {
    const { message } = await req.json();

    console.log("Received message from frontend:", message);

    const reply = `Gemini mock: I received -> "${message}"`;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in getGeminiResponse route:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
