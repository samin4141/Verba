# Frontend

React app for practicing English/IELTS stuff.

## What you get

- Speaking practice with AI (talk and get feedback)
- Listening exercises using YouTube videos
- Reading passages with questions
- Writing feedback as you type
- Dark mode because why not
- Progress tracking

## Stack

- React 18 + TypeScript
- Vite (fast as hell)
- Tailwind for CSS
- Radix UI primitives for components
- React Router for navigation
- TanStack Query for data fetching
- React Hook Form + Zod for forms

## Running it

```bash
npm install
npm run dev
```

Opens at `http://localhost:8080`

## Building

```bash
npm run build
npm run preview
```

## Project layout

```
src/
├── components/     # all the UI stuff
│   ├── ui/        # buttons, inputs, basic components
│   ├── sections/  # the main feature sections
├── pages/         # actual pages you see
├── contexts/      # React contexts (theme, etc)
├── hooks/         # custom hooks
├── lib/           # random utilities
└── main.tsx       # where it all starts
```

## Scripts

- `npm run dev` - starts dev server
- `npm run build` - builds for prod
- `npm run lint` - runs linter

## Features

**Speaking**
Talk to the AI, it transcribes what you say and gives you feedback. Works like the actual IELTS speaking test.

**Listening**  
Watch YouTube videos, answer questions about them. Has transcripts and everything.

**Reading**
AI generates passages at your level. Mix of different question types.

**Writing**
Write essays or letters, get feedback on grammar, vocab, structure. Real-time suggestions while you type.

## Env variables

Make a `.env` file if you want to configure stuff:

```
VITE_API_URL=http://localhost:8000
```

That's pretty much it since we removed all the auth stuff.
