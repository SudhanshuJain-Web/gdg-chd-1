/**
 * AETHERIA WEATHER - Atmospheric Intelligence
 * High-performance, real-time dark-mode weather application
 */

// Application State
const state = {
  currentCity: 'Chandigarh',
  currentCountry: 'India',
  currentLat: 30.7333,
  currentLon: 76.7794,
  currentUnit: 'C', // 'C' | 'F'
  weatherData: null,
  timezone: 'auto',
  activeEffect: 'clear' // 'clear' | 'rain' | 'clouds' | 'stars'
};

// DOM Elements
const DOM = {
  cityInput: document.getElementById('cityInput'),
  searchSubmitBtn: document.getElementById('searchSubmitBtn'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  searchSuggestions: document.getElementById('searchSuggestions'),
  geoBtn: document.getElementById('geoBtn'),
  unitC: document.getElementById('unitC'),
  unitF: document.getElementById('unitF'),
  cityChips: document.querySelectorAll('.city-chip'),
  statusBanner: document.getElementById('statusBanner'),
  loadingOverlay: document.getElementById('loadingOverlay'),
  
  // Weather card
  conditionBadge: document.getElementById('conditionBadge'),
  cityName: document.getElementById('cityName'),
  countryName: document.getElementById('countryName'),
  localTime: document.getElementById('localTime'),
  dayNightPill: document.getElementById('dayNightPill'),
  dayNightText: document.getElementById('dayNightText'),
  currentTemp: document.getElementById('currentTemp'),
  mainWeatherIcon: document.getElementById('mainWeatherIcon'),
  weatherDesc: document.getElementById('weatherDesc'),
  feelsLikeTemp: document.getElementById('feelsLikeTemp'),
  todayMax: document.getElementById('todayMax'),
  todayMin: document.getElementById('todayMin'),
  
  // Telemetry metrics
  windSpeed: document.getElementById('windSpeed'),
  windUnit: document.getElementById('windUnit'),
  windDirection: document.getElementById('windDirection'),
  humidityVal: document.getElementById('humidityVal'),
  humidityDesc: document.getElementById('humidityDesc'),
  precipVal: document.getElementById('precipVal'),
  precipDesc: document.getElementById('precipDesc'),
  pressureVal: document.getElementById('pressureVal'),
  
  // Forecasts
  hourlyForecastContainer: document.getElementById('hourlyForecastContainer'),
  weeklyForecastContainer: document.getElementById('weeklyForecastContainer'),
  
  // Canvas
  weatherCanvas: document.getElementById('weatherCanvas')
};

// ==========================================================================
// Weather Code Mappings & SVG Icon Definitions
// ==========================================================================

const WMO_CONDITIONS = {
  0: { label: 'Clear Sky', category: 'clear' },
  1: { label: 'Mainly Clear', category: 'mainly-clear' },
  2: { label: 'Partly Cloudy', category: 'partly-cloudy' },
  3: { label: 'Overcast', category: 'cloudy' },
  45: { label: 'Foggy', category: 'fog' },
  48: { label: 'Depositing Rime Fog', category: 'fog' },
  51: { label: 'Light Drizzle', category: 'drizzle' },
  53: { label: 'Moderate Drizzle', category: 'drizzle' },
  55: { label: 'Dense Drizzle', category: 'drizzle' },
  56: { label: 'Freezing Drizzle', category: 'drizzle' },
  57: { label: 'Dense Freezing Drizzle', category: 'drizzle' },
  61: { label: 'Slight Rain', category: 'rain' },
  63: { label: 'Moderate Rain', category: 'rain' },
  65: { label: 'Heavy Rain', category: 'rain-heavy' },
  66: { label: 'Freezing Rain', category: 'rain' },
  67: { label: 'Heavy Freezing Rain', category: 'rain-heavy' },
  71: { label: 'Slight Snowfall', category: 'snow' },
  73: { label: 'Moderate Snowfall', category: 'snow' },
  75: { label: 'Heavy Snowfall', category: 'snow' },
  77: { label: 'Snow Grains', category: 'snow' },
  80: { label: 'Slight Rain Showers', category: 'rain' },
  81: { label: 'Moderate Rain Showers', category: 'rain' },
  82: { label: 'Violent Rain Showers', category: 'rain-heavy' },
  85: { label: 'Slight Snow Showers', category: 'snow' },
  86: { label: 'Heavy Snow Showers', category: 'snow' },
  95: { label: 'Thunderstorm', category: 'thunder' },
  96: { label: 'Thunderstorm with Hail', category: 'thunder' },
  99: { label: 'Severe Thunderstorm', category: 'thunder' }
};

/**
 * Returns animated SVG icon markup for a weather condition and day/night state.
 */
function getWeatherIconSvg(code, isDay = 1, size = 'hero') {
  const isNight = isDay === 0;
  const condition = WMO_CONDITIONS[code] || { category: 'clear', label: 'Clear' };
  const cat = condition.category;

  if (cat === 'clear') {
    if (isNight) {
      return `
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#475569"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <path d="M56 22C42.7 22 32 32.7 32 46C32 59.3 42.7 70 56 70C60.8 70 65.2 68.6 69 66.1C55.2 65.8 44 54.4 44 40.5C44 28.5 52.2 18.5 63.4 15.6C61 22 56 22 56 22Z" 
                fill="url(#moonGrad)" stroke="#334155" stroke-width="1.5" filter="url(#moonGlow)"/>
          <circle cx="76" cy="30" r="2.2" fill="#0284c7" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="28" cy="34" r="1.8" fill="#64748b" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="70" cy="62" r="1.8" fill="#64748b" opacity="0.8">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      `;
    }
    // Sunny Clear
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fbbf24"/>
            <stop offset="65%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#d97706"/>
          </radialGradient>
        </defs>
        <g class="svg-sun-rays" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round">
          <line x1="50" y1="12" x2="50" y2="20"/>
          <line x1="50" y1="80" x2="50" y2="88"/>
          <line x1="12" y1="50" x2="20" y2="50"/>
          <line x1="80" y1="50" x2="88" y2="50"/>
          <line x1="23" y1="23" x2="29" y2="29"/>
          <line x1="71" y1="71" x2="77" y2="77"/>
          <line x1="23" y1="77" x2="29" y2="71"/>
          <line x1="71" y1="29" x2="77" y2="23"/>
        </g>
        <circle cx="50" cy="50" r="22" fill="url(#sunGrad)" class="svg-sun-core"/>
      </svg>
    `;
  }

  if (cat === 'mainly-clear' || cat === 'partly-cloudy') {
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunPartGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </radialGradient>
          <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>
        <!-- Sun/Moon behind -->
        ${isNight ? `
          <path d="M42 22C33 22 25 30 25 40C25 50 33 58 42 58C46 58 49 57 52 55C41 55 33 46 33 35C33 25 40 18 48 16C46 22 42 22 42 22Z" fill="#475569"/>
        ` : `
          <g class="svg-sun-rays" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round">
            <line x1="38" y1="16" x2="38" y2="22"/>
            <line x1="16" y1="38" x2="22" y2="38"/>
            <line x1="23" y1="23" x2="27" y2="27"/>
            <line x1="53" y1="23" x2="49" y2="27"/>
          </g>
          <circle cx="38" cy="38" r="16" fill="url(#sunPartGrad)"/>
        `}
        <!-- Floating Cloud -->
        <g class="svg-cloud">
          <path d="M38 72H72C78.6 72 84 66.6 84 60C84 53.8 79.3 48.6 73.2 48.1C71.8 38.6 63.7 32 54 32C44.7 32 37.1 38.1 34.9 46.9C33.6 46.3 32.1 46 30.5 46C23.6 46 18 51.6 18 58.5C18 65.9 24 72 31.4 72H38Z" 
                fill="url(#cloudGrad1)"/>
        </g>
      </svg>
    `;
  }

  if (cat === 'cloudy' || cat === 'fog') {
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cloudOvercast" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
        </defs>
        <g class="svg-cloud">
          <path d="M32 72H74C80.6 72 86 66.6 86 60C86 53.6 81.1 48.3 74.8 48C73.1 37.6 64.2 30 53.5 30C43.2 30 34.8 36.8 32.4 46.5C30.9 45.9 29.2 45.5 27.5 45.5C20 45.5 14 51.5 14 59C14 66.2 19.8 72 27 72H32Z" 
                fill="url(#cloudOvercast)"/>
          ${cat === 'fog' ? `
            <line x1="24" y1="78" x2="76" y2="78" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
            <line x1="30" y1="84" x2="70" y2="84" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
          ` : ''}
        </g>
      </svg>
    `;
  }

  if (cat === 'rain' || cat === 'drizzle' || cat === 'rain-heavy') {
    const isHeavy = cat === 'rain-heavy';
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cloudRainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#64748b"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <path d="M30 58H72C77.5 58 82 53.5 82 48C82 42.8 78 38.5 73 38C71.5 29.5 64 23 55 23C46.5 23 39.5 28.5 37.5 36.5C36.2 36 34.8 35.7 33.3 35.7C27 35.7 22 40.7 22 47C22 53.1 26.9 58 33 58H30Z" 
              fill="url(#cloudRainGrad)"/>
        <!-- Rain Drops -->
        <g stroke="#0284c7" stroke-width="${isHeavy ? '3' : '2.4'}" stroke-linecap="round">
          <line x1="34" y1="64" x2="31" y2="74" class="svg-rain-drop-1"/>
          <line x1="50" y1="64" x2="47" y2="74" class="svg-rain-drop-2"/>
          <line x1="66" y1="64" x2="63" y2="74" class="svg-rain-drop-3"/>
          ${isHeavy ? `
            <line x1="42" y1="72" x2="39" y2="82" class="svg-rain-drop-3"/>
            <line x1="58" y1="72" x2="55" y2="82" class="svg-rain-drop-1"/>
          ` : ''}
        </g>
      </svg>
    `;
  }

  if (cat === 'thunder') {
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cloudThunder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <path d="M30 56H72C77.5 56 82 51.5 82 46C82 40.8 78 36.5 73 36C71.5 27.5 64 21 55 21C46.5 21 39.5 26.5 37.5 34.5C36.2 34 34.8 33.7 33.3 33.7C27 33.7 22 38.7 22 45C22 51.1 26.9 56 33 56H30Z" 
              fill="url(#cloudThunder)"/>
        <!-- Lightning Bolt -->
        <polygon points="52,54 44,68 51,68 46,84 60,67 52,67 57,54" 
                 fill="#f59e0b" class="svg-bolt"/>
        <!-- Rain Drops -->
        <g stroke="#0284c7" stroke-width="2.2" stroke-linecap="round">
          <line x1="32" y1="62" x2="29" y2="72" class="svg-rain-drop-1"/>
          <line x1="68" y1="62" x2="65" y2="72" class="svg-rain-drop-2"/>
        </g>
      </svg>
    `;
  }

  if (cat === 'snow') {
    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cloudSnow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>
        <path d="M30 56H72C77.5 56 82 51.5 82 46C82 40.8 78 36.5 73 36C71.5 27.5 64 21 55 21C46.5 21 39.5 26.5 37.5 34.5C36.2 34 34.8 33.7 33.3 33.7C27 33.7 22 38.7 22 45C22 51.1 26.9 56 33 56H30Z" 
              fill="url(#cloudSnow)"/>
        <!-- Snow crystals -->
        <g fill="#38bdf8" opacity="0.95">
          <circle cx="36" cy="68" r="3" class="svg-rain-drop-1"/>
          <circle cx="52" cy="74" r="3.5" class="svg-rain-drop-2"/>
          <circle cx="68" cy="68" r="3" class="svg-rain-drop-3"/>
        </g>
      </svg>
    `;
  }

  // Fallback icon
  return `
    <svg viewBox="0 0 100 100" fill="none" stroke="#0284c7" stroke-width="4">
      <circle cx="50" cy="50" r="30"/>
    </svg>
  `;
}

// Convert Celsius to Fahrenheit
function toFahrenheit(celsius) {
  return Math.round((celsius * 9 / 5) + 32);
}

// Format temperature according to current unit
function formatTemp(tempC) {
  if (tempC === null || tempC === undefined || isNaN(tempC)) return '--';
  return state.currentUnit === 'F' ? toFahrenheit(tempC) : Math.round(tempC);
}

// Wind degrees to cardinal direction
function degreesToCardinal(deg) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

// ==========================================================================
// Dynamic Canvas Weather Effects (Light-Mode Adapted Particles)
// ==========================================================================

class WeatherCanvasFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;
    this.effectType = 'stars'; // 'stars' | 'rain' | 'sun' | 'clouds'
    this.width = 0;
    this.height = 0;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  setEffect(effect) {
    if (this.effectType === effect) return;
    this.effectType = effect;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    const count = this.effectType === 'rain' ? 80 : (this.effectType === 'stars' ? 55 : 35);

    for (let i = 0; i < count; i++) {
      if (this.effectType === 'stars') {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 2 + 0.8,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          direction: Math.random() > 0.5 ? 1 : -1
        });
      } else if (this.effectType === 'rain') {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          length: Math.random() * 16 + 10,
          speedY: Math.random() * 10 + 12,
          speedX: Math.random() * 1.5 - 0.75,
          alpha: Math.random() * 0.45 + 0.25
        });
      } else if (this.effectType === 'sun') {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 3.5 + 1.2,
          alpha: Math.random() * 0.35 + 0.15,
          speedY: -(Math.random() * 0.4 + 0.2),
          speedX: Math.random() * 0.3 - 0.15
        });
      } else { // clouds / mist
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 45 + 25,
          alpha: Math.random() * 0.08 + 0.03,
          speedX: Math.random() * 0.3 + 0.1
        });
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      if (this.effectType === 'stars') {
        p.alpha += p.speed * p.direction;
        if (p.alpha <= 0.1) {
          p.alpha = 0.1;
          p.direction = 1;
        } else if (p.alpha >= 0.8) {
          p.alpha = 0.8;
          p.direction = -1;
        }
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(79, 70, 229, ${p.alpha * 0.6})`;
        this.ctx.shadowBlur = 3;
        this.ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
        this.ctx.fill();
      } else if (this.effectType === 'rain') {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > this.height) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.speedX, p.y + p.length);
        this.ctx.strokeStyle = `rgba(2, 132, 199, ${p.alpha * 0.8})`;
        this.ctx.lineWidth = 1.6;
        this.ctx.stroke();
      } else if (this.effectType === 'sun') {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.7})`;
        this.ctx.fill();
      } else { // clouds
        p.x += p.speedX;
        if (p.x > this.width + p.radius) {
          p.x = -p.radius;
          p.y = Math.random() * this.height;
        }
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
        this.ctx.fill();
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
}

let weatherFX;

// ==========================================================================
// API & Data Services
// ==========================================================================

/**
 * Searches for cities using Open-Meteo Geocoding API
 */
async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding service unavailable');
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn('Geocoding search warning:', err);
    return [];
  }
}

/**
 * Fetches comprehensive weather telemetry from Open-Meteo
 */
async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch weather failed, generating fallback data:', err);
    return generateFallbackWeatherData(lat, lon);
  }
}

/**
 * Realistic fallback generator in case of network disconnect
 */
function generateFallbackWeatherData(lat, lon) {
  const now = new Date();
  const baseTemp = 24 + Math.sin(now.getHours() / 24 * Math.PI * 2) * 6;
  const hourlyTimes = [];
  const hourlyTemps = [];
  const hourlyCodes = [];
  const hourlyIsDay = [];

  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() + i * 3600000);
    hourlyTimes.push(d.toISOString().slice(0, 16));
    const hr = d.getHours();
    const isDay = hr >= 6 && hr <= 18 ? 1 : 0;
    hourlyIsDay.push(isDay);
    hourlyTemps.push(Math.round((baseTemp + Math.sin((hr - 6) / 12 * Math.PI) * 5) * 10) / 10);
    hourlyCodes.push(i % 5 === 0 ? 2 : 0);
  }

  const dailyTimes = [];
  const dailyMax = [];
  const dailyMin = [];
  const dailyCodes = [];

  for (let d = 0; d < 7; d++) {
    const dayDate = new Date(now.getTime() + d * 86400000);
    dailyTimes.push(dayDate.toISOString().slice(0, 10));
    dailyMax.push(Math.round(baseTemp + 4 + (d % 3)));
    dailyMin.push(Math.round(baseTemp - 5 - (d % 2)));
    dailyCodes.push([0, 1, 2, 61, 2, 0, 1][d % 7]);
  }

  return {
    timezone: 'UTC',
    current: {
      temperature_2m: Math.round(baseTemp),
      relative_humidity_2m: 54,
      apparent_temperature: Math.round(baseTemp + 1),
      is_day: now.getHours() >= 6 && now.getHours() <= 18 ? 1 : 0,
      precipitation: 0.0,
      weather_code: 0,
      wind_speed_10m: 12.5,
      wind_direction_10m: 140,
      surface_pressure: 1013
    },
    hourly: {
      time: hourlyTimes,
      temperature_2m: hourlyTemps,
      weather_code: hourlyCodes,
      is_day: hourlyIsDay
    },
    daily: {
      time: dailyTimes,
      temperature_2m_max: dailyMax,
      temperature_2m_min: dailyMin,
      weather_code: dailyCodes
    }
  };
}

// ==========================================================================
// UI Rendering
// ==========================================================================

function renderUI() {
  const data = state.weatherData;
  if (!data || !data.current) return;

  const current = data.current;
  const isDay = current.is_day;
  const code = current.weather_code;
  const condition = WMO_CONDITIONS[code] || { label: 'Clear Sky', category: 'clear' };

  // Set Ambient Canvas Effect
  if (condition.category.includes('rain') || condition.category.includes('drizzle')) {
    weatherFX?.setEffect('rain');
  } else if (isDay === 0) {
    weatherFX?.setEffect('stars');
  } else if (condition.category === 'clear') {
    weatherFX?.setEffect('sun');
  } else {
    weatherFX?.setEffect('clouds');
  }

  // Location & Day/Night Pill
  DOM.cityName.textContent = state.currentCity;
  DOM.countryName.textContent = state.currentCountry;
  
  if (isDay === 1) {
    DOM.dayNightPill.classList.remove('night');
    DOM.dayNightText.textContent = 'Daytime';
  } else {
    DOM.dayNightPill.classList.add('night');
    DOM.dayNightText.textContent = 'Nighttime';
  }

  // Local Time
  updateLocalTimeDisplay(data.timezone);

  // Condition Badge & Desc
  DOM.conditionBadge.textContent = condition.label;
  DOM.weatherDesc.textContent = condition.label;

  // Temperature
  DOM.currentTemp.textContent = formatTemp(current.temperature_2m);
  DOM.feelsLikeTemp.textContent = `${formatTemp(current.apparent_temperature)}°`;

  // Daily Max & Min for Today
  if (data.daily && data.daily.temperature_2m_max) {
    DOM.todayMax.textContent = `${formatTemp(data.daily.temperature_2m_max[0])}°`;
    DOM.todayMin.textContent = `${formatTemp(data.daily.temperature_2m_min[0])}°`;
  }

  // Hero SVG Icon
  DOM.mainWeatherIcon.innerHTML = getWeatherIconSvg(code, isDay, 'hero');

  // Telemetry Metrics
  DOM.windSpeed.textContent = Math.round(current.wind_speed_10m);
  DOM.windDirection.textContent = degreesToCardinal(current.wind_direction_10m);
  DOM.humidityVal.textContent = current.relative_humidity_2m;
  
  // Humidity description
  const h = current.relative_humidity_2m;
  DOM.humidityDesc.textContent = h < 30 ? 'Dry air' : (h > 70 ? 'Humid' : 'Comfortable');

  DOM.precipVal.textContent = (current.precipitation || 0.0).toFixed(1);
  DOM.precipDesc.textContent = (current.precipitation > 0) ? 'Precipitation active' : 'No rain expected';
  
  DOM.pressureVal.textContent = Math.round(current.surface_pressure || 1013);

  // Render Forecasts
  renderHourlyForecast(data);
  renderWeeklyForecast(data);
}

function updateLocalTimeDisplay(tz) {
  try {
    const validTz = (tz && tz !== 'auto') ? tz : undefined;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    DOM.localTime.textContent = formatter.format(now);
  } catch (e) {
    const now = new Date();
    DOM.localTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Render 24-Hour Timeline
 */
function renderHourlyForecast(data) {
  if (!data.hourly || !data.hourly.time) return;

  const times = data.hourly.time;
  const temps = data.hourly.temperature_2m;
  const codes = data.hourly.weather_code;
  const isDays = data.hourly.is_day;

  // Determine current local hour in target timezone
  let currentHourISO = '';
  try {
    const validTz = (data.timezone && data.timezone !== 'auto') ? data.timezone : undefined;
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: validTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(now);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    const h = parts.find(p => p.type === 'hour')?.value;
    if (y && m && d && h) {
      currentHourISO = `${y}-${m}-${d}T${h}`;
    }
  } catch (e) {
    // fallback
  }

  let startIndex = currentHourISO ? times.findIndex(t => t.startsWith(currentHourISO)) : -1;
  if (startIndex === -1) {
    // Find closest timestamp
    const now = new Date();
    const nowTime = now.getTime();
    startIndex = 0;
    let minDiff = Infinity;
    for (let j = 0; j < times.length; j++) {
      const diff = Math.abs(new Date(times[j]).getTime() - nowTime);
      if (diff < minDiff) {
        minDiff = diff;
        startIndex = j;
      }
    }
  }

  let html = '';
  const maxHours = Math.min(24, times.length - startIndex);

  for (let i = 0; i < maxHours; i++) {
    const idx = startIndex + i;
    const timeStr = times[idx];
    const isNow = i === 0;

    // Format hour label
    const dateObj = new Date(timeStr);
    let hourDisplay = isNow ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    const temp = formatTemp(temps[idx]);
    const icon = getWeatherIconSvg(codes[idx], isDays[idx], 'small');

    html += `
      <div class="hourly-card ${isNow ? 'now' : ''}">
        <span class="hourly-time">${hourDisplay}</span>
        <div class="hourly-icon">${icon}</div>
        <span class="hourly-temp">${temp}°</span>
      </div>
    `;
  }

  DOM.hourlyForecastContainer.innerHTML = html;
}

/**
 * Render 7-Day Extended Outlook
 */
function renderWeeklyForecast(data) {
  if (!data.daily || !data.daily.time) return;

  const days = data.daily.time;
  const maxTemps = data.daily.temperature_2m_max;
  const minTemps = data.daily.temperature_2m_min;
  const codes = data.daily.weather_code;

  // Find absolute max and min for bar proportions
  const overallMax = Math.max(...maxTemps);
  const overallMin = Math.min(...minTemps);
  const tempSpread = Math.max(1, overallMax - overallMin);

  let html = '';

  for (let i = 0; i < days.length && i < 7; i++) {
    const dateObj = new Date(days[i] + 'T00:00:00');
    const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    const condition = WMO_CONDITIONS[codes[i]] || { label: 'Clear' };
    const icon = getWeatherIconSvg(codes[i], 1, 'mini');

    const maxT = formatTemp(maxTemps[i]);
    const minT = formatTemp(minTemps[i]);

    // Percentage for visual range bar
    const leftPercent = Math.max(0, Math.min(100, ((minTemps[i] - overallMin) / tempSpread) * 100));
    const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((maxTemps[i] - minTemps[i]) / tempSpread) * 100));

    html += `
      <div class="weekly-row">
        <span class="weekly-day">${dayName}</span>
        <div class="weekly-condition">
          <div class="weekly-mini-icon">${icon}</div>
          <span>${condition.label}</span>
        </div>
        <div class="weekly-bar-container">
          <span class="bar-min-label">${minT}°</span>
          <div class="bar-track">
            <div class="bar-fill" style="margin-left: ${leftPercent}%; width: ${widthPercent}%;"></div>
          </div>
          <span class="bar-max-label">${maxT}°</span>
        </div>
        <div class="weekly-temps-alt">
          <span class="temp-hi">${maxT}°</span>
          <span class="temp-lo">${minT}°</span>
        </div>
      </div>
    `;
  }

  DOM.weeklyForecastContainer.innerHTML = html;
}

// ==========================================================================
// Action Handlers
// ==========================================================================

async function loadWeatherForCity(cityName, countryName, lat, lon) {
  showLoading(true);
  hideBanner();

  state.currentCity = cityName;
  state.currentCountry = countryName || '';
  state.currentLat = lat;
  state.currentLon = lon;

  updateActiveCityChip(cityName);

  try {
    const data = await fetchWeather(lat, lon);
    state.weatherData = data;
    state.timezone = data.timezone;
    renderUI();
  } catch (err) {
    showBanner(`Could not load weather for ${cityName}. Showing estimate.`, 'error');
  } finally {
    showLoading(false);
  }
}

function showLoading(show) {
  DOM.loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showBanner(message, type = 'info') {
  DOM.statusBanner.className = `status-banner ${type}`;
  DOM.statusBanner.querySelector('.status-message').textContent = message;
  DOM.statusBanner.style.display = 'flex';
}

function hideBanner() {
  DOM.statusBanner.style.display = 'none';
}

function updateActiveCityChip(cityName) {
  DOM.cityChips.forEach(chip => {
    if (chip.dataset.city.toLowerCase() === cityName.toLowerCase()) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

// ==========================================================================
// Search & Suggestions Autocomplete
// ==========================================================================

let debounceTimer = null;

DOM.cityInput.addEventListener('input', (e) => {
  const query = e.target.value;
  DOM.clearSearchBtn.style.display = query.length > 0 ? 'flex' : 'none';

  clearTimeout(debounceTimer);
  if (query.trim().length < 2) {
    DOM.searchSuggestions.style.display = 'none';
    DOM.searchSuggestions.innerHTML = '';
    return;
  }

  debounceTimer = setTimeout(async () => {
    const results = await searchCities(query);
    if (!results || results.length === 0) {
      DOM.searchSuggestions.innerHTML = `<div class="p-4 text-center text-sm text-slate-500">No matching cities found</div>`;
      DOM.searchSuggestions.style.display = 'block';
      return;
    }

    DOM.searchSuggestions.innerHTML = results.map(city => {
      const admin = city.admin1 ? `${city.admin1}, ` : '';
      return `
        <div class="suggestion-item px-4 py-3 hover:bg-sky-50 transition-colors flex items-center justify-between cursor-pointer border-b border-slate-100 last:border-b-0" 
             data-name="${city.name}" 
             data-country="${city.country || ''}" 
             data-lat="${city.latitude}" 
             data-lon="${city.longitude}">
          <div>
            <div class="suggestion-main font-semibold text-slate-900 text-sm sm:text-base">${city.name}</div>
            <div class="suggestion-sub text-xs text-slate-500">${admin}${city.country || ''}</div>
          </div>
          <span class="text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-full transition-colors">Select →</span>
        </div>
      `;
    }).join('');

    DOM.searchSuggestions.style.display = 'block';
  }, 250);
});

// Click on search suggestion
DOM.searchSuggestions.addEventListener('click', (e) => {
  const item = e.target.closest('.suggestion-item');
  if (!item || !item.dataset.lat) return;

  const name = item.dataset.name;
  const country = item.dataset.country;
  const lat = parseFloat(item.dataset.lat);
  const lon = parseFloat(item.dataset.lon);

  DOM.cityInput.value = name;
  DOM.searchSuggestions.style.display = 'none';
  loadWeatherForCity(name, country, lat, lon);
});

// Close suggestions on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box-wrapper')) {
    DOM.searchSuggestions.style.display = 'none';
  }
});

// Clear search input button
DOM.clearSearchBtn.addEventListener('click', () => {
  DOM.cityInput.value = '';
  DOM.clearSearchBtn.style.display = 'none';
  DOM.searchSuggestions.style.display = 'none';
  DOM.cityInput.focus();
});

// Submit search query
async function handleSearchSubmit() {
  const query = DOM.cityInput.value.trim();
  if (!query) return;

  DOM.searchSuggestions.style.display = 'none';
  showLoading(true);

  const results = await searchCities(query);
  if (results && results.length > 0) {
    const top = results[0];
    DOM.cityInput.value = top.name;
    loadWeatherForCity(top.name, top.country, top.latitude, top.longitude);
  } else {
    showBanner(`Could not locate "${query}". Please check the spelling.`, 'error');
    showLoading(false);
  }
}

DOM.searchSubmitBtn.addEventListener('click', handleSearchSubmit);
DOM.cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleSearchSubmit();
  }
});

// Quick select city chips
DOM.cityChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const city = chip.dataset.city;
    const country = chip.dataset.country;
    const lat = parseFloat(chip.dataset.lat);
    const lon = parseFloat(chip.dataset.lon);

    DOM.cityInput.value = city;
    DOM.clearSearchBtn.style.display = 'flex';
    loadWeatherForCity(city, country, lat, lon);
  });
});

// Unit switchers (°C / °F)
DOM.unitC.addEventListener('click', () => {
  if (state.currentUnit === 'C') return;
  state.currentUnit = 'C';
  DOM.unitC.classList.add('active');
  DOM.unitC.setAttribute('aria-pressed', 'true');
  DOM.unitF.classList.remove('active');
  DOM.unitF.setAttribute('aria-pressed', 'false');
  renderUI();
});

DOM.unitF.addEventListener('click', () => {
  if (state.currentUnit === 'F') return;
  state.currentUnit = 'F';
  DOM.unitF.classList.add('active');
  DOM.unitF.setAttribute('aria-pressed', 'true');
  DOM.unitC.classList.remove('active');
  DOM.unitC.setAttribute('aria-pressed', 'false');
  renderUI();
});

// Geolocation ("My Location")
DOM.geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showBanner('Geolocation is not supported by your browser.', 'error');
    return;
  }

  showLoading(true);
  showBanner('Detecting your coordinates...', 'info');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        // Reverse geocoding via Open-Meteo or client API
        const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        let detectedCity = 'Your Location';
        let detectedCountry = '';

        try {
          const revRes = await fetch(revUrl);
          if (revRes.ok) {
            const revData = await revRes.json();
            detectedCity = revData.city || revData.locality || revData.principalSubdivision || 'Current Location';
            detectedCountry = revData.countryName || '';
          }
        } catch (e) {
          console.log('Reverse geocode fallback:', e);
        }

        DOM.cityInput.value = detectedCity;
        DOM.clearSearchBtn.style.display = 'flex';
        await loadWeatherForCity(detectedCity, detectedCountry, lat, lon);
        showBanner(`Updated to local telemetry: ${detectedCity}`, 'info');
        setTimeout(hideBanner, 4000);
      } catch (err) {
        showBanner('Error retrieving local weather coordinates.', 'error');
      } finally {
        showLoading(false);
      }
    },
    (err) => {
      showLoading(false);
      showBanner('Location access denied or unavailable. You can search any city manually.', 'error');
      setTimeout(hideBanner, 5000);
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
});

// ==========================================================================
// Initialization
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Initialize dynamic atmospheric canvas
  weatherFX = new WeatherCanvasFX(DOM.weatherCanvas);

  // Load initial city (Chandigarh)
  loadWeatherForCity(state.currentCity, state.currentCountry, state.currentLat, state.currentLon);
});
