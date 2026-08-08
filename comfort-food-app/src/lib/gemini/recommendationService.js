import { ai, MODEL_NAME } from './client';
import { buildPrompt } from './prompt';
import { RECOMMENDATION_SCHEMA } from './schema';

export async function getRecommendation({ vent, environment, company, dietary, avoidIngredients }) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: buildPrompt({ vent, environment, company, dietary, avoidIngredients }),
    config: {
      responseMimeType: 'application/json',
      responseSchema: RECOMMENDATION_SCHEMA,
    },
  });

  return JSON.parse(response.text);
}
