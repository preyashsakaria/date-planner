# Date Planner 💕

A mobile-first, interactive date invitation web app built with pure vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies — just a beautifully crafted single-page experience designed to make someone smile.

## What It Does

Send someone a personalised date invitation link. They open it on their phone, go through a fun 7-step flow, pick their preferences, and confirm — all in under 2 minutes.

## The 7-Step Flow

| Step | Screen | What Happens |
|------|--------|-------------|
| 1 | **The Invitation** | A multilingual greeting cycles through languages. An evasive "No" button runs away when tapped. |
| 2 | **The Celebration** | Confetti bursts across the screen with a dancing cat GIF. |
| 3 | **Pick a Date & Time** | Calendar restricted to the next 14 days with a time picker. |
| 4 | **Food Vibes** | Choose from 9 food options (Burger, Sushi, Tacos, Pizza, Brunch, Pasta, Ice Cream, Coffee, Fancy Drinks) with real images. |
| 5 | **Activity** | Choose from 8 activities (Bowling, Mini Golf, Movie, Picnic, Museum, Cat Café, Rock Climbing, River Walk) with real images. |
| 6 | **Excitement Slider** | Rate excitement from 1–10 with dynamic colour changes and emoji reactions (😐 → 😊 → 🥰 → 🔥). |
| 7 | **Confirmation Receipt** | A receipt-style summary of all selections with an optional comment box. Tap confirm to send everything via WhatsApp. |

## Features

### Design & UX
- **Mobile-first** — designed for smartphones, scales up to desktop
- **Glassmorphism cards** — frosted glass effect with backdrop blur
- **Slide transitions** — steps slide left/right like turning pages in a story
- **Progress dots** — Instagram Stories-style dots showing current position
- **Confetti engine** — pure vanilla canvas particle system (no libraries)
- **Floating hearts** — gentle floating emoji background on middle steps
- **Micro-interactions** — bounce on tap, pulse glow on selection, checkmark badges, shimmer on buttons
- **Dynamic slider** — colour gradient and emoji change in real-time as you drag
- **Receipt shimmer** — golden shimmer animation on the final confirmation card
- **Heartbeat footer** — subtle animated heart in the footer signature

### Technical
- **Zero dependencies** — no npm, no React, no Tailwind, no libraries
- **Pure vanilla** — HTML + CSS + JavaScript only
- **All assets local** — every image is stored in `/assets/`, no external image URLs
- **Tenor GIF embeds** — cat GIFs embedded via Tenor (non-interactive, auto-looping)
- **WhatsApp integration** — one-tap sends all selections as a formatted message
- **14-day calendar lock** — date picker only allows the next 2 weeks
- **Evasive button physics** — the "No" button calculates random positions within the screen frame bounds

## Project Structure

```
date-planner/
├── index.html          # Single-page app structure (7 steps)
├── styles.css          # Complete design system (glassmorphism, animations, transitions)
├── app.js              # State machine, transitions, confetti engine, slider logic
└── assets/             # All local images and GIFs
    ├── burger.jpg
    ├── sushi.jpg
    ├── tacos.jpg
    ├── pizza.jpg
    ├── brunch.jpg
    ├── italian.jpg
    ├── icecream.jpg
    ├── coffee.jpg
    ├── cocktail.jpg
    ├── bowling.jpg
    ├── minigolf.jpg
    ├── movie.jpg
    ├── picnic.jpg
    ├── museum.jpg
    ├── catcafe.jpg
    ├── climbing.jpg
    ├── river.jpg
    └── ...
```

## How to Use

1. Clone the repo
2. Open `index.html` in any browser
3. That's it. No build step, no install, no server required.

To customise for your own date:
- Edit the name and greeting in `index.html` (Step 1)
- Change the WhatsApp number in `app.js` (search for `const phone`)
- Swap images in the `assets/` folder
- Adjust the greeting languages array in `app.js`

## Design Principles

- **Emotion before features** — every element serves the emotional arc
- **Story before interaction** — the flow builds excitement from calm to celebration
- **Memorable before impressive** — small delightful moments over flashy complexity
- **Simple before complex** — no accounts, no setup, just open and go
- **Mobile-first** — designed for the device it will actually be opened on

## Built With

- HTML5
- CSS3 (animations, glassmorphism, grid)
- Vanilla JavaScript (ES6+)
- Canvas API (confetti)
- Tenor GIF Embeds
- WhatsApp URL API

## Checkpoints

| Tag | Description |
|-----|-------------|
| `checkpoint-1` | Initial working version with all 7 steps, images, and WhatsApp integration |
| `checkpoint-2` | UX overhaul with slide transitions, confetti, progress dots, glassmorphism, and micro-interactions |

---

Made with ♥
