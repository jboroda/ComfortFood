# 🍲 Comfort Food Challenge — Culinary Therapy Engine

> Vent your stress or describe your day. Get matched with one perfect comfort dish and 6 ways to make or find it.

Built for the [DEV.to Comfort Food Frontend Challenge](https://dev.to/devteam/join-our-latest-frontend-challenge-comfort-food-edition-28a0).

**Live demo:** https://comfort-food-git-main-jenny-borodas-projects.vercel.app

---

## What it does

1. You describe how you're feeling — type it out or pick a mood emoji
2. Set your vibe (cozy cabin, date night, solo, etc.) and any dietary restrictions
3. The app matches you with a comfort dish tailored to your emotional state
4. Get 6 ways to execute it: 15-min express, 2-hour deep dive, cook with a friend, minimalist 5-ingredient, find a local spot, or order delivery
5. Copy a shopping list or text it to yourself

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| AI | [Google Gemini API](https://ai.google.dev) via `@google/genai` |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Deployment | [Vercel](https://vercel.com) |
| Analytics | Vercel Analytics |

---

## Running locally

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/comfort-food-app.git
cd comfort-food-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Gemini API key

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

Get a free API key at [https://aistudio.google.com](https://aistudio.google.com).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |

> `.env.local` is listed in `.gitignore` and never committed.

---

## License

[MIT](./LICENSE)
