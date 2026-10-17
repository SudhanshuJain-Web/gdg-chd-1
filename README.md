# Aetheria Weather 🌦️

A modern, high-precision light-mode weather dashboard crafted with **Tailwind CSS**, **HTML5**, and **JavaScript**.

---

## ✨ Features

- **Clean White & Slate-50 Aesthetic**: Minimalist, elevated light-mode design with subtle ambient glow, frosted glass cards (`backdrop-blur-md`), and high-contrast typography (`text-slate-900`, `Outfit` and `Plus Jakarta Sans`).
- **Tailwind CSS Utility Architecture**: Integrated via Tailwind Play CDN with custom brand color palette (`sky`, `indigo`, `emerald`, `amber`) and glass shadow patterns.
- **Real-Time Global Weather Data**: Powered by the Open-Meteo API — free, highly accurate, and requires no API key.
- **Animated SVG Weather Conditions**: Dynamic weather icons with CSS animations (spinning sun rays, pulsating celestial glows, drifting clouds, falling rain drops, and lightning flashes) calibrated for high visibility on light cards.
- **Ambient Canvas System**: Interactive HTML5 canvas particle background that reacts to live weather (gentle falling sky-blue raindrops, golden solar aura particles, atmospheric mist, and twilight stars).
- **Search Autocomplete**: Real-time debounced geocoding search with instant suggestion dropdown for any city worldwide.
- **Quick City Switching**: Instant 1-click preview chips for popular destinations (Chandigarh, New York, London, Tokyo, Dubai, Paris).
- **Geolocation Integration**: One-click "My Location" button with automatic GPS coordinate detection.
- **Unit Conversion**: Instant toggle between Celsius (°C) and Fahrenheit (°F) across all metrics and forecasts.
- **Detailed Atmospheric Telemetry**:
  - Current Temperature & Apparent "Feels Like"
  - Wind speed & 16-point cardinal compass direction
  - Relative Humidity with air comfort index
  - Precipitation depth (mm)
  - Atmospheric Surface Pressure (hPa)
  - 24-Hour hourly forecast reel
  - 7-Day extended outlook with proportional temperature range bars

---

## 🚀 Getting Started

Simply open `index.html` directly in any modern browser:

```bash
# Option 1: Open index.html directly in your default browser
start index.html

# Option 2: Serve with Python
python -m http.server 8080
# Then visit http://localhost:8080
```

---

## 📁 File Structure

```
├── index.html        # Semantic dashboard markup with Tailwind CSS utilities
├── style.css         # Light-mode tokens, animations & canvas styles
├── app.js            # Open-Meteo telemetry integration & canvas particle engine
└── README.md         # Documentation
```
