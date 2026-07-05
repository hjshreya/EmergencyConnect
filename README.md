# EmergencyConnect

> Instantly locate and contact emergency services near you — no login, no friction, just help.

![HTML](https://img.shields.io/badge/HTML-1.2%25-orange)
![CSS](https://img.shields.io/badge/CSS-19.7%25-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-79.1%25-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

## Features
- Detects your location automatically via browser Geolocation API
- Finds nearby hospitals, police stations, and fire stations
- One-tap call buttons for emergency contacts
- Zero install — runs directly in the browser
- No login, no account, no friction

## Getting Started

No installation needed. This is a vanilla JS project.

### Option 1 — Just open it
````bash
git clone https://github.com/hjshreya/EmergencyConnect.git
cd EmergencyConnect
open index.html
````

### Option 2 — Serve locally (recommended)
````bash
npx serve .
````
Then open `http://localhost:3000`

## Project Structure
````
EmergencyConnect/
├── index.html      # App shell and markup
├── script.js       # Core logic — geolocation, maps, emergency data
└── style.css       # Styling and responsive layout
````

## Built With
- Vanilla JavaScript (no frameworks)
- Browser Geolocation API
- HTML5 + CSS3

##  Why I Built This
In emergencies, every second counts. Most apps require login or too many steps. EmergencyConnect is designed to be the fastest possible path from panic to help — open the page, see what's near you, tap to call.

## Roadmap
- [ ] Offline support via Service Workers
- [ ] Multi-language support
- [ ] SMS fallback when internet is unavailable
- [ ] PWA installable on home screen

## 📄 License
MIT
