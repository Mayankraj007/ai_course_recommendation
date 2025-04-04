const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Clean response to remove unwanted special characters (excluding dots, dashes, colons)
const cleanResponse = (text) => {
  return text.replace(/[^\w\s\u0900-\u097F\-:.]/g, "");
};

app.post("/suggest-courses", async (req, res) => {
  try {
    const { interests, pastEnrollments } = req.body;

    if (!interests || !pastEnrollments) {
      return res
        .status(400)
        .json({ error: "Both interests and pastEnrollments are required." });
    }

    const prompt = `
Based on the interests and past enrollments below, suggest 5 personalized online courses.
- Use short bullet points.
- Mention course names and topics.
- Keep responses crisp and professional.
- Do not include emojis or decorative characters.

Interests: ${interests}
Past Enrollments: ${pastEnrollments}
    `;

    const geminiResponse = await Promise.race([
      axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        contents: [{ parts: [{ text: prompt }] }],
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 8000)
      ),
    ]);

    const rawText =
      geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate course suggestions.";

    const suggestions = cleanResponse(rawText);

    res.json({ suggestions });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({
      suggestions: "Unable to fetch suggestions. Please try again later.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
