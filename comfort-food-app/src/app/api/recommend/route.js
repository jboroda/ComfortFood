import { isRateLimited } from './rateLimiter';
import { getRecommendation } from '@/lib/gemini/recommendationService';

const JUDGE_CODE = process.env.JUDGE_ACCESS_CODE;

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }

  try {
    const { vent, environment, company, dietary, avoidIngredients, judgeCode } = await request.json();

    if (!JUDGE_CODE || judgeCode !== JUDGE_CODE) {
      return Response.json({ error: 'Invalid or missing access code.' }, { status: 401 });
    }
    // keep this in sync with MAX_CHARS on the client — server-side check is the
    // real guard, the client one's just there so people aren't surprised
    if (!vent || typeof vent !== 'string' || vent.trim().length === 0) {
      return Response.json({ error: 'Vent field is required.' }, { status: 400 });
    }
    if (vent.length > 500) {
      return Response.json({ error: 'Vent exceeds 500 character limit.' }, { status: 400 });
    }

    const recommendation = await getRecommendation({ vent, environment, company, dietary, avoidIngredients });
    return Response.json(recommendation);
  } catch (error) {
    // Gemini calls fail (quota, malformed schema response,
    // network blip) — log the real error server-side, the client falls back to
    // FALLBACK_DATA so the user still gets something instead of a blank error page.
    console.error('Gemini API Error:', error);
    return Response.json(
      { error: 'Failed to process comfort food request', details: error.message },
      { status: 500 }
    );
  }
}
