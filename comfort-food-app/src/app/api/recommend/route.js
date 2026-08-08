import { isRateLimited } from './rateLimiter';
import { getRecommendation } from '@/lib/gemini/recommendationService';

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

    const recommendation = await getRecommendation({ vent, environment, company, dietary, avoidIngredients });
    return Response.json(recommendation);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return Response.json(
      { error: 'Failed to process comfort food request', details: error.message },
      { status: 500 }
    );
  }
}
