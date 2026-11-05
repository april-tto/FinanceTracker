// Backend for the AI Chatbot.
// Gets the user's question, asks Gemini AI, and sends back the answer.

import { sampleTransactions } from "../../data/sampleTransactions";

export async function POST(request: Request) {
  const body = await request.json();

  // the message we send to the AI
  const prompt =
    "You are a financial advisor in a Finance Tracker app. Give short and simple advice. " +
    "These are the user's transactions: " + JSON.stringify(sampleTransactions) +
    " The user's question is: " + body.question;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "" + process.env.GEMINI_API_KEY, // our key from .env.local
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data)); // shows what Gemini sent back (helps find errors)
    const answer = data.candidates[0].content.parts[0].text;

    return Response.json({ answer: answer });
  } catch (error) {
    console.log("Error:", error);
    return Response.json({ answer: "Sorry, the AI is not available right now." });
  }
}