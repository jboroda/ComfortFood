export function buildPrompt({ vent, environment, company, dietary, avoidIngredients }) {
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

  return `
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
}
