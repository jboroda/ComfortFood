'use client';

import { useState, useRef, useEffect } from 'react';
import ChipToggle from './components/ChipToggle';
import { Express15Min, DeepDive2Hour, FriendCook, Minimalist5, SearchCard } from './components/PathwayCards';
import { FALLBACK_DATA } from './fallback';
import { googleMapsSearchUrl, googleSearchUrl } from '@/lib/links';
import { Analytics } from "@vercel/analytics/next"

const LOADING_MESSAGES = [
  'Matching emotional state with culinary comfort...',
  'Consulting the comfort food archives...',
  'Crafting your perfect dish prescription...',
];

const MOOD_EMOJIS = [
  { emoji: '😤', text: "I'm frustrated and overwhelmed" },
  { emoji: '😢', text: "I'm sad and need comfort" },
  { emoji: '😰', text: "I'm stressed and anxious" },
  { emoji: '😴', text: "I'm exhausted and drained" },
  { emoji: '🥳', text: "I'm celebrating something!" },
  { emoji: '😔', text: "I'm lonely and need warmth" },
];

const TABS = [
  { id: 'express15Min',  label: '⚡ 15-Min Express' },
  { id: 'deepDive2Hour', label: '🫕 2-Hr Therapy' },
  { id: 'friendCook',    label: '👥 With a Friend' },
  { id: 'minimalist5',   label: '🥫 ≤ 5 Items' },
  { id: 'localSpot',     label: '📍 Local Spot' },
  { id: 'onlineOrder',   label: '🛵 Fast Delivery' },
];

const DIETARY_OPTIONS = [
  { label: 'Vegan',       emoji: '🌱' },
  { label: 'Vegetarian',  emoji: '🥦' },
  { label: 'Kosher',      emoji: '✡️' },
  { label: 'Halal',       emoji: '☪️' },
  { label: 'Gluten-Free', emoji: '🌾' },
  { label: 'Dairy-Free',  emoji: '🥛' },
];

const AVOID_OPTIONS = [
  { label: 'Cilantro',    emoji: '🌿' },
  { label: 'Liver',       emoji: '🫀' },
  { label: 'Anchovies',   emoji: '🐟' },
  { label: 'Blue Cheese', emoji: '🧀' },
  { label: 'Olives',      emoji: '🫒' },
  { label: 'Durian',      emoji: '🌵' },
];

export default function Home() {
  const [vent, setVent] = useState('');
  const [environment, setEnvironment] = useState('🌲 Cozy Cabin');
  const [company, setCompany] = useState('🧘 Solo Sanctuary');
  const [dietary, setDietary] = useState([]);
  const [avoidIngredients, setAvoidIngredients] = useState([]);
  const [showPrefs, setShowPrefs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('express15Min');
  const [error, setError] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [listCopied, setListCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  const getShoppingList = () => {
    const p = data?.pathways;
    const ingredients =
      p?.express15Min?.ingredients ??
      p?.deepDive2Hour?.ingredients ??
      p?.friendCook?.ingredients ??
      p?.minimalist5?.ingredients ?? [];
    const dish = data?.heroDish?.name ?? 'My Comfort Dish';
    return `🛒 Shopping List — ${dish}\n\n${ingredients.map(i => `• ${i}`).join('\n')}`;
  };

  const handleCopyList = async () => {
    await navigator.clipboard.writeText(getShoppingList());
    setListCopied(true);
    setTimeout(() => setListCopied(false), 2000);
  };

  const handleTextList = () => {
    const body = encodeURIComponent(getShoppingList());
    window.location.href = `sms:?&body=${body}`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `I just got matched with "${data.heroDish?.name}" by the Comfort Food Challenge! 🍲`;
    if (navigator.share) {
      await navigator.share({ title: text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resultsRef = useRef(null);
  const MAX_CHARS = 500;

  const envOptions = ['🌲 Cozy Cabin', '☀️ Tropical Escape', '🏙️ Bustling City', '🏠 Childhood Kitchen'];
  const companyOptions = ['🧘 Solo Sanctuary', '👯 With a Buddy', '🍷 Date Night', '👨👩👧👦 Family Meal'];

  const toggle = (setter) => (value) =>
    setter((prev) => prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 2000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vent.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    setMsgIndex(0);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vent,
          environment,
          company,
          dietary: dietary.join(', '),
          avoidIngredients: avoidIngredients.map((l) => l.toLowerCase()),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.details || result.error || 'Failed to fetch recommendation');
      setData(result);
      setActiveTab('express15Min');
    } catch (err) {
      setError(err.message);
      setData(FALLBACK_DATA);
      setActiveTab('express15Min');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPathway = () => {
    const p = data.pathways;
    switch (activeTab) {
      case 'express15Min':  return p.express15Min  && <Express15Min data={p.express15Min} />;
      case 'deepDive2Hour': return p.deepDive2Hour && <DeepDive2Hour data={p.deepDive2Hour} dishName={data.heroDish.name} />;
      case 'friendCook':    return p.friendCook    && <FriendCook data={p.friendCook} />;
      case 'minimalist5':   return p.minimalist5   && <Minimalist5 data={p.minimalist5} />;
      case 'localSpot':     return p.localSpot     && (
        <SearchCard data={p.localSpot}
          href={googleMapsSearchUrl(p.localSpot.searchQuery || data.heroDish.name)}
          btnLabel="📍 Search on Google Maps"
          ariaLabel={`Find local spots for ${data.heroDish.name}`} />
      );
      case 'onlineOrder':   return p.onlineOrder   && (
        <SearchCard data={p.onlineOrder}
          href={googleSearchUrl(p.onlineOrder.searchQuery || data.heroDish.name)}
          btnLabel="🛵 Find Delivery Options"
          ariaLabel={`Order ${data.heroDish.name} for delivery`} />
      );
      default: return null;
    }
  };

  return (
    <main className="min-h-screen text-stone-100 font-sans">

      {/* Hero header */}
      <header className="relative overflow-hidden py-8 sm:py-10 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {/* Left cluster — flying left to right */}
          <img src="/hero-grandma-no-background_e.png" alt=""
            className="absolute top-2 left-[4%] sm:left-[8%] h-14 sm:h-24 md:h-28 w-auto animate-float [animation-delay:-0.6s]" style={{ '--float-rot': '6deg' }} />
          {/* <img src="/hero-grandma-no-background_c.png" alt=""
            className="absolute top-[40%] left-[1%] sm:left-[3%] h-10 sm:h-16 md:h-20 w-auto animate-float [animation-delay:-2.4s]" style={{ '--float-rot': '4deg' }} /> */}
          <img src="/hero-grandma-no-background_d.png" alt=""
            className="absolute bottom-1 left-[10%] sm:left-[14%] h-9 sm:h-12 md:h-16 w-auto animate-float [animation-delay:-1.8s]" style={{ '--float-rot': '-3deg' }} />

          {/* Right cluster — flying right to left */}
          <img src="/hero-grandma-no-background_a.PNG" alt=""
            className="absolute top-1 right-[4%] sm:right-[8%] h-14 sm:h-24 md:h-28 w-auto animate-float" style={{ '--float-rot': '-6deg' }} />
          <img src="/hero-grandma-no-background_b.png" alt=""
            className="absolute bottom-0 right-[12%] sm:right-[16%] h-9 sm:h-16 md:h-20 w-auto animate-float [animation-delay:-1.2s]" style={{ '--float-rot': '3deg' }} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-block px-3.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
            Culinary Therapy Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Comfort Food Challenge
          </h1>
          <p className="text-stone-300 max-w-xl mx-auto text-sm sm:text-base drop-shadow">
            Vent your stress or describe your day. We'll match you with one perfect comfort dish and 6 ways to execute it.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-10">

        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="vent-input" className="block text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                  How are you feeling right now? Vent or describe your day...
                </label>
                <span className={`text-xs ${vent.length >= MAX_CHARS ? 'text-red-400 font-bold' : 'text-stone-500'}`} aria-live="polite">
                  {vent.length} / {MAX_CHARS}
                </span>
              </div>
              <textarea id="vent-input" rows={4} maxLength={MAX_CHARS} value={vent}
                onChange={(e) => setVent(e.target.value)}
                placeholder="I've been staring at spreadsheets for 9 hours, my manager pushed a deadline up, and it's cold outside..."
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed"
                required />
              <div className="flex flex-wrap gap-2 mt-2">
                {MOOD_EMOJIS.map(({ emoji, text }) => (
                  <button key={emoji} type="button"
                    onClick={() => setVent((v) => v ? v : text)}
                    title={text}
                    className="text-xl hover:scale-125 transition-transform">{emoji}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <fieldset>
                <legend className="block text-xs font-medium text-stone-400 mb-2">Desired Vibe</legend>
                <div className="flex flex-wrap gap-1.5">
                  {envOptions.map((option) => (
                    <button key={option} type="button" onClick={() => setEnvironment(option)}
                      aria-pressed={environment === option}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${environment === option ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10'}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="block text-xs font-medium text-stone-400 mb-2">Dining Dynamic</legend>
                <div className="flex flex-wrap gap-1.5">
                  {companyOptions.map((option) => (
                    <button key={option} type="button" onClick={() => setCompany(option)}
                      aria-pressed={company === option}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${company === option ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10'}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div>
              <button type="button" onClick={() => setShowPrefs((p) => !p)}
                className="flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition">
                <span className={`transition-transform duration-200 inline-block ${showPrefs ? 'rotate-90' : ''}`}>▶</span>
                ⚙️ Preferences
                {(dietary.length > 0 || avoidIngredients.length > 0) && (
                  <span className="ml-1 px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full text-[10px]">
                    {dietary.length + avoidIngredients.length} active
                  </span>
                )}
              </button>
              {showPrefs && (
                <div className="mt-4 space-y-4 pl-1">
                  <fieldset>
                    <legend className="block text-xs font-medium text-stone-400 mb-2">Dietary Restrictions</legend>
                    <ChipToggle options={DIETARY_OPTIONS} selected={dietary} onToggle={toggle(setDietary)}
                      activeClass="bg-green-900/70 border border-green-700 text-green-200"
                      inactiveClass="bg-white/5 border border-white/10 text-stone-400 hover:bg-white/10 hover:text-stone-200" />
                  </fieldset>
                  <fieldset>
                    <legend className="block text-xs font-medium text-stone-400 mb-2">
                      I don't like... <span className="text-stone-600">(highlighted = excluded)</span>
                    </legend>
                    <ChipToggle options={AVOID_OPTIONS} selected={avoidIngredients} onToggle={toggle(setAvoidIngredients)}
                      activeClass="bg-red-900/70 border border-red-700 text-red-200 line-through opacity-75"
                      inactiveClass="bg-white/5 border border-white/10 text-stone-400 hover:bg-white/10 hover:text-stone-200" />
                  </fieldset>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !vent.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-stone-950 font-bold rounded-2xl transition shadow-lg shadow-amber-500/20 text-base cursor-pointer">
              {loading ? 'Analyzing Mood & Crafting Dish...' : 'Find My Comfort Dish'}
            </button>
          </form>
        </section>

        {error && !data && (
          <div role="alert" className="bg-red-950/60 border border-red-700 text-red-300 p-4 rounded-2xl text-xs flex items-start gap-3">
            <span className="shrink-0">⚠️</span>
            <div><strong className="text-red-200 block mb-0.5">Something went wrong.</strong>{error}</div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 space-y-3" aria-live="polite" aria-busy="true">
            <div className="inline-block w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" aria-hidden="true" />
            <p className="text-stone-400 text-sm animate-pulse">{LOADING_MESSAGES[msgIndex]}</p>
          </div>
        )}

        {data && (
          <section ref={resultsRef} className="space-y-4 animate-fade-in" aria-label="Comfort food recommendation">

            {/* Fallback banner */}
            {data.isFallback && (
              <div role="alert" className="bg-stone-800/60 border border-stone-600 text-stone-300 p-4 rounded-2xl text-xs flex items-start gap-3">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <strong className="text-stone-200 block mb-0.5">Our kitchen is taking a quick break.</strong>
                  The AI is temporarily unavailable — but you still deserve comfort. Here's a classic recipe to hold you over. Try again in a moment.
                </div>
              </div>
            )}

            {data.encouragingWords && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-amber-200 text-sm leading-relaxed flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">💛</span>
                <div>
                  <strong className="block text-amber-400 font-semibold mb-1">A Note for You:</strong>
                  {data.encouragingWords}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-b from-white/10 to-white/5 border border-amber-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Your Emotional Match</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{data.heroDish?.name}</h2>
              <p className="text-sm italic text-amber-200/90 max-w-lg mx-auto">"{data.heroDish?.tagline}"</p>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed bg-black/20 p-4 rounded-xl border border-white/10">
                {data.heroDish?.whyItHeals}
              </p>
            </div>

            {data.pathways && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider text-center">
                  Select How You Want To Execute This Dish:
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="Pathway options">
                  {TABS.map((tab) => (
                    <button key={tab.id} role="tab" aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 py-2.5 px-3 rounded-xl text-xs font-semibold border transition whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-md'
                          : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200 hover:bg-white/10'
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div role="tabpanel" aria-label={TABS.find(t => t.id === activeTab)?.label}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                  {renderPathway() ?? (
                    <p className="text-center text-stone-500 text-sm py-4">Not available for this dish.</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-4 flex-wrap border-t border-white/10">
              <button onClick={handleCopyList}
                className="px-6 py-3 bg-green-900/50 hover:bg-green-900/70 border border-green-600/50 text-green-300 hover:text-green-100 font-semibold rounded-2xl transition text-sm">
                {listCopied ? '✅ Copied!' : '📋 Copy Shopping List'}
              </button>
              {isMobile && (
                <button onClick={handleTextList}
                  className="px-6 py-3 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-600/50 text-blue-300 hover:text-blue-100 font-semibold rounded-2xl transition text-sm">
                  📱 Text to Myself
                </button>
              )}
              <button onClick={handleShare}
                className="px-6 py-3 bg-amber-900/50 hover:bg-amber-900/70 border border-amber-600/50 text-amber-300 hover:text-amber-100 font-semibold rounded-2xl transition text-sm">
                {copied ? '✅ Copied!' : '🔗 Share This Dish'}
              </button>
              <button onClick={handleReset}
                className="px-6 py-3 bg-stone-700/60 hover:bg-stone-700/80 border border-stone-500/50 text-stone-200 hover:text-white font-semibold rounded-2xl transition text-sm">
                🔄 Find Another Recipe
              </button>
            </div>

          </section>
        )}

      </div>

      <footer className="text-center text-xs text-stone-600 space-y-1 pb-6">
        <p>Built for the <a href="https://dev.to/devteam/join-our-latest-frontend-challenge-comfort-food-edition-28a0" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-amber-500 transition underline">DEV.to Comfort Food Challenge</a></p>
        <p>Powered by Gemini AI · Zero cost to you</p>
      </footer>
    </main>
  );
}
