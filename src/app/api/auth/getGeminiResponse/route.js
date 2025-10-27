import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";

// --- Initialize Firestore (run once globally) ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

// --- Gemini setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message, chatId = "defaultChat" } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch existing chat context from Firestore
    const chatRef = db.collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();
    const history = chatDoc.exists ? chatDoc.data().messages || [] : [];

    // Build context prompt
    const prompt =
      history.map((m) => `${m.sender}: ${m.text}`).join("\n") +
      `\nuser: ${message}`;

    // Generate response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // Save conversation to Firestore
    const userMsg = {
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };
    const botMsg = {
      sender: "bot",
      text: reply,
      timestamp: new Date().toISOString(),
    };

    await chatRef.set(
      { messages: [...history, userMsg, botMsg] },
      { merge: true }
    );

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Gemini response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
