/**
 * Groq AI Service
 * 
 * Handles interactions with the Groq API to summarize reviews.
 * Uses the llama-3.3-70b-versatile model to generate structured JSON summaries.
 */

const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_ID = 'llama-3.3-70b-versatile';

/**
 * Summarizes a list of reviews using Groq AI.
 * 
 * @param {string} locationName - Name of the location.
 * @param {Array} reviews - Array of review objects from Google Places API.
 * @returns {Promise<Object>} - Structured summary (sentiment, pros, cons, themes, verdict).
 */
async function summarizeReviews(locationName, reviews) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new Error('Missing Groq API Key');

        if (!reviews || reviews.length === 0) {
            return {
                sentiment: 'Neutral',
                pros: [],
                cons: [],
                themes: [],
                verdict: 'No reviews available to analyze.',
            };
        }

        // Format reviews for the prompt
        // We limit to top 5-10 reviews usually, but Google API returns up to 5 by default in details
        const reviewsText = reviews.map((r, index) => {
            // Handle cases where text might be missing or empty
            const text = r.text || 'No text review';
            const rating = r.rating || 'N/A';
            return `Review ${index + 1} (${rating} stars): "${text}"`;
        }).join('\n\n');

        // Construct the prompt exactly as requested
        const systemPrompt = `You are a helpful assistant that analyzes Google Maps reviews. Analyze these reviews for ${locationName} and provide a structured summary.

Reviews:
${reviewsText}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "sentiment": "Positive" or "Mixed" or "Negative",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "themes": ["theme 1", "theme 2", "theme 3"],
  "verdict": "A 2-3 sentence summary of the overall customer experience"
}

Rules:
- sentiment must be exactly one of: Positive, Mixed, Negative
- Include 3-5 items in pros and cons arrays
- Include 3-5 themes
- Keep verdict concise and helpful
- Base everything on the actual reviews provided`;

        // Call Groq API
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: MODEL_ID,
                messages: [
                    { role: 'user', content: systemPrompt } // Using 'user' role as prompt is dynamic
                ],
                temperature: 0.5, // Balance creativity and consistency
                response_format: { type: "json_object" } // Force JSON response if supported, or rely on prompt instruction
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Parse the response
        const aiContent = response.data.choices[0].message.content;

        // Parse JSON safely
        let parsedSummary;
        try {
            parsedSummary = JSON.parse(aiContent);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', aiContent);
            // Fallback object to prevent app crash
            parsedSummary = {
                sentiment: 'Mixed',
                pros: ['Detailed analysis failed'],
                cons: ['Could not parse AI response'],
                themes: [],
                verdict: 'We encountered an issue summarizing these reviews. Please read individual reviews below.',
            };
        }

        return parsedSummary;

    } catch (error) {
        console.error('Error in summarizeReviews:', error.response ? error.response.data : error.message);
        throw new Error('Failed to generate AI summary.');
    }
}

module.exports = {
    summarizeReviews,
};
