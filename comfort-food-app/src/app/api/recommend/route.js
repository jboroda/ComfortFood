import { GoogleGenAI, Type } from '@google/genai';
import { isRateLimited } from './rateLimiter';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }

  try {
    const { vent, environment, company, dietary, avoidIngredients } = await request.json();

    if (!vent || typeof vent !== 'string' || vent.trim().length === 0) {
      return Response.json({ error: 'Vent field is required.' }, { status: 400 });
    }
    if (vent.length > 500) {
      return Response.json({ error: 'Vent exceeds 500 character limit.' }, { status: 400 });
    }

    const isHalal = typeof dietary === 'string' && dietary.toLowerCase().includes('halal');
    const userAvoid = Array.isArray(avoidIngredients) ? avoidIngredients : [];

    const dietaryLine = dietary?.trim()
      ? `- Dietary requirements (strict, must be respected): ${dietary.trim()}.`
      : '- No specific dietary restrictions.';
    const avoidLine = userAvoid.length > 0
      ? `- Exclude these ingredients from all pathways: ${userAvoid.join(', ')}.`
      : '';
    const wineLine = isHalal
      ? '- Do NOT include any wine or alcohol pairing.'
      : '- friendCook.winePairing: suggest one wine or beverage that complements the dish.';

    const prompt = `
You are an empathetic culinary guide for a "Comfort Food Challenge".
User situation:
- Vent/Stress: "${vent.trim()}"
- Desired Vibe: "${environment || 'Cozy'}"
- Dining Dynamic: "${company || 'Solo Sanctuary'}"
${dietaryLine}
${avoidLine}
${wineLine}

CULINARY STYLE: Draw inspiration from NYT Cooking recipes — chef-driven, technique-forward, with bold but approachable flavors. Think the style of Samin Nosrat, Melissa Clark, or Alison Roman: recipes that explain *why* each step matters, use seasonal or pantry-friendly ingredients, and feel like a trusted friend is guiding you. The deepDive2Hour pathway should especially reflect this style.

TASKS:
1. encouragingWords: 2-3 warm empathetic sentences validating their stress.
2. heroDish: ONE perfect comfort dish matching their mood, respecting all dietary rules and exclusions.
3. pathways — provide ALL 6, each fully populated:
   - express15Min: title, summary, ingredients (4-6 items), instructions (4-6 steps for a quick version).
   - deepDive2Hour: title, summary, ingredients (8-12 items), instructions (6-10 steps, NYT Cooking style with technique notes).
   - friendCook: title, summary, ingredients (full list), personA duties (3-4 tasks), personB duties (3-4 tasks), winePairing.
   - minimalist5: title, summary, ingredients (exactly 5 pantry staples), instructions (3-5 steps).
   - localSpot: title, summary, searchQuery (bias toward "NYT Cooking [dish]" style search).
   - onlineOrder: title, summary, searchQuery.
All array fields must be non-empty. Do not omit any field.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            encouragingWords: { type: Type.STRING },
            heroDish: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tagline: { type: Type.STRING },
                whyItHeals: { type: Type.STRING },
              },
              required: ['name', 'tagline', 'whyItHeals'],
            },
            pathways: {
              type: Type.OBJECT,
              properties: {
                express15Min: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'summary', 'ingredients', 'instructions'],
                },
                deepDive2Hour: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'summary', 'ingredients', 'instructions'],
                },
                friendCook: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    personA: { type: Type.ARRAY, items: { type: Type.STRING } },
                    personB: { type: Type.ARRAY, items: { type: Type.STRING } },
                    winePairing: { type: Type.STRING },
                  },
                  required: ['title', 'summary', 'ingredients', 'personA', 'personB'],
                },
                minimalist5: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'summary', 'ingredients', 'instructions'],
                },
                localSpot: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    searchQuery: { type: Type.STRING },
                  },
                  required: ['title', 'summary', 'searchQuery'],
                },
                onlineOrder: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    searchQuery: { type: Type.STRING },
                  },
                  required: ['title', 'summary', 'searchQuery'],
                },
              },
              required: ['express15Min', 'deepDive2Hour', 'friendCook', 'minimalist5', 'localSpot', 'onlineOrder'],
            },
          },
          required: ['encouragingWords', 'heroDish', 'pathways'],
        },
      },
    });

    const parsedData = JSON.parse(response.text);
    return Response.json(parsedData);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json(
      { error: 'Failed to process comfort food request', details: error.message },
      { status: 500 }
    );
  }
}
