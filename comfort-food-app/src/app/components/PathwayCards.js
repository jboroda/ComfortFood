const card = 'bg-white/5 border border-white/10 rounded-xl p-3';

// express15Min and minimalist5 both just want an ingredients+instructions
// list, so this is shared instead of copy-pasted between the two
function RecipeLayout({ ingredients, instructions }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className={card}>
        <span className="text-xs font-bold text-amber-400 block mb-3">🛒 Ingredients</span>
        <ul className="space-y-1.5">
          {ingredients?.map((ing, i) => (
            <li key={i} className="text-xs text-stone-300 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5 shrink-0">•</span>{ing}
            </li>
          ))}
        </ul>
      </div>
      <div className={card}>
        <span className="text-xs font-bold text-amber-400 block mb-3">👨🍳 Instructions</span>
        <ol className="space-y-2">
          {instructions?.map((step, i) => (
            <li key={i} className="text-xs text-stone-300 flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">{i + 1}.</span>{step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Express15Min({ data }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-amber-400">{data.title}</h4>
      <p className="text-xs text-stone-400">{data.summary}</p>
      <RecipeLayout ingredients={data.ingredients} instructions={data.instructions} />
    </div>
  );
}

export function DeepDive2Hour({ data, dishName }) {
  const recipeQuery = encodeURIComponent(`${dishName} NYT Cooking recipe`);
  return (
    <div className="space-y-5">
      <h4 className="text-lg font-bold text-amber-400">{data.title}</h4>
      <p className="text-xs text-stone-400">{data.summary}</p>
      <RecipeLayout ingredients={data.ingredients} instructions={data.instructions} />
      <div className="flex flex-wrap gap-3 pt-1">
        <a href={`https://www.youtube.com/results?search_query=${recipeQuery}`}
          target="_blank" rel="noopener noreferrer"
          aria-label={`Watch ${dishName} recipe on YouTube`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 text-xs font-semibold rounded-xl transition">
          ▶ Watch on YouTube
        </a>
        <a href={`https://cooking.nytimes.com/search?q=${encodeURIComponent(dishName)}`}
          target="_blank" rel="noopener noreferrer"
          aria-label={`Search ${dishName} on NYT Cooking`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 text-xs font-semibold rounded-xl transition">
          🗞 NYT Cooking
        </a>
        <a href={`https://www.google.com/search?q=${recipeQuery}`}
          target="_blank" rel="noopener noreferrer"
          aria-label={`Search ${dishName} recipe on Google`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 text-xs font-semibold rounded-xl transition">
          🔍 Google Recipe
        </a>
      </div>
    </div>
  );
}

export function FriendCook({ data }) {
  return (
    <div className="space-y-5">
      <h4 className="text-lg font-bold text-amber-400">{data.title}</h4>
      <p className="text-xs text-stone-400">{data.summary}</p>
      <div className={card}>
        <span className="text-xs font-bold text-amber-400 block mb-3">🛒 Shared Ingredients</span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {data.ingredients?.map((ing, i) => (
            <li key={i} className="text-xs text-stone-300 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5 shrink-0">•</span>{ing}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['🧑🍳 Person A Duties', data.personA], ['🧑🍳 Person B Duties', data.personB]].map(([label, items]) => (
          <div key={label} className={card}>
            <span className="text-xs font-bold text-amber-400 block mb-2">{label}</span>
            <ul className="space-y-1.5 text-xs text-stone-300">
              {items?.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {data.winePairing && (
        <div className="flex items-start gap-3 bg-purple-950/40 border border-purple-800/50 rounded-xl p-4">
          <span className="text-lg" aria-hidden="true">🍷</span>
          <div>
            <span className="text-xs font-bold text-purple-300 block mb-1">Pairing Suggestion</span>
            <p className="text-xs text-purple-200 leading-relaxed">{data.winePairing}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Minimalist5({ data }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-amber-400">{data.title}</h4>
      <p className="text-xs text-stone-400">{data.summary}</p>
      <div className="flex flex-wrap gap-2">
        {data.ingredients?.map((ing, i) => (
          <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-stone-200">
            🥫 {ing}
          </span>
        ))}
      </div>
      {data.instructions?.length > 0 && (
        <div className={card}>
          <span className="text-xs font-bold text-amber-400 block mb-3">👨🍳 Instructions</span>
          <ol className="space-y-2">
            {data.instructions.map((step, i) => (
              <li key={i} className="text-xs text-stone-300 flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0">{i + 1}.</span>{step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export function SearchCard({ data, href, btnLabel, ariaLabel }) {
  return (
    <div className="space-y-4 text-center py-4">
      <h4 className="text-lg font-bold text-amber-400">{data.title}</h4>
      <p className="text-xs text-stone-400 max-w-md mx-auto">{data.summary}</p>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition text-sm shadow-lg">
        {btnLabel} <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
