// Asks Google Gemini (free tier) to read the Catalan event text and
// return the fields we need, in English and in a fixed JSON shape.

// Same list as frontend/src/lib/categories.ts
const CATEGORIES = [
  'painting',
  'photography',
  'sculpture',
  'illustration',
  'installation',
  'mixed media',
];

export interface EventDetails {
  description: string;
  category: string;
  address: string;
  price: number;
}

// The shape Gemini must answer with ("structured output").
// Because of "enum", the category is always one of ours.
const DETAILS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    description: { type: 'STRING' },
    category: { type: 'STRING', enum: CATEGORIES },
    address: { type: 'STRING' },
    price: { type: 'NUMBER' },
  },
  required: ['description', 'category', 'address', 'price'],
};

// The part of Gemini's response that we read
interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

// Returns null when there is no API key or Gemini fails:
// the import then goes on without AI.
export async function extractEventDetails(
  title: string,
  venue: string,
  pageText: string,
): Promise<EventDetails | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const prompt = `You help an app that lists art gallery openings in Barcelona.
Read this event page (in Catalan) and answer in JSON:
- description: 2 or 3 sentences in English about the exhibition. Do not invent facts
  and ignore notes about when the event appears in the agenda.
- category: the one that fits best.
- address: street, one number and postal code only (no floor, door or number range),
  e.g. "Carrer de Consell de Cent, 315, 08007 Barcelona". It is used to find the place on a map.
- price: in euros, 0 if it is free.
Write names exactly as on the page, with their accents (e.g. "Sèneca").

Title: ${title}
Venue: ${venue}
Page: ${pageText}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: DETAILS_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(30000), // give up after 30 seconds
    });
    if (!response.ok) {
      return null;
    }
    const result = (await response.json()) as GeminiResponse;
    // Gemini's answer is a JSON text inside the first "candidate"
    const answer = result.candidates[0].content.parts[0].text;
    return JSON.parse(answer) as EventDetails;
  } catch {
    return null;
  }
}
