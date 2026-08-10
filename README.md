# TaskHub — Project Management Frontend

A premium, modern project management web application built with **Next.js 15**, **TypeScript**, and **Vanilla CSS**. It connects to a [Django REST Framework](https://www.django-rest-framework.org/) backend for all data operations.

![TaskHub](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

---

## Features

- 🔐 **Authentication** — Token-based login & registration via the Django backend
- 📁 **Projects** — Create and view your projects
- 👥 **Teams** — Create and manage teams, assign them to projects
- 🌑 **Dark Mode UI** — Glassmorphism design with smooth micro-animations
- ⚡ **App Router** — Fully uses Next.js 15 App Router with TypeScript

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Next.js 15 (App Router) |
| Language   | TypeScript              |
| Styling    | Vanilla CSS (custom design system) |
| Auth       | Django Token Auth (via `Authorization: Token <token>`) |
| State      | React `useState` / `useEffect` |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- The Django backend running at `http://localhost:8000`

### 1. Clone the repo

```bash
git clone https://github.com/adarsh-pathak-2006/Task-Management_UI.git
cd Task-Management_UI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set your backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

1. Push your code to GitHub (already done ✅).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import this repository.
3. In the **Environment Variables** section, add:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com/api` |

4. Click **Deploy**. Vercel will auto-detect Next.js and build it.

> **Important**: Make sure your Django backend has your Vercel deployment URL added to `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `settings.py`.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing / Login / Register page
│   ├── layout.tsx            # Root layout (fonts, global CSS)
│   ├── globals.css           # Design system (CSS variables, components)
│   └── dashboard/
│       ├── layout.tsx        # Dashboard shell with sidebar
│       ├── page.tsx          # Overview / profile page
│       ├── projects/
│       │   └── page.tsx      # Projects list + creation
│       └── teams/
│           └── page.tsx      # Teams list + creation
└── lib/
    └── api.ts                # API client (auth token injection, error handling)
```

---

## Backend Repository

The Django REST API backend lives here:  
👉 [github.com/adarsh-pathak-2006/Project_management_system](https://github.com/adarsh-pathak-2006/Project_management_system)

---

## License

MIT
