# Frontend Design & Environment Guidelines

## 1. Zero-Build Tailwind CSS Workflow
- When Tailwind CSS is requested in projects without Node.js or when building standalone static web applications, use the Tailwind Play CDN:
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            body: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          },
          colors: { ... }
        }
      }
    };
  </script>
  ```
- This avoids dependency on npm/npx while providing the complete utility class set, custom configurations, and theme extensions immediately out of the box.

## 2. Dynamic Canvas & SVG Theme Contrast
- When designing or transitioning themes (dark mode <-> light mode):
  - **Canvas Particles**: Adjust particle RGBA values, opacity thresholds, and stroke weights. For instance, raindrops on dark mode use glowing cyan (`rgba(56, 189, 248, 0.4)`), whereas on white backgrounds they require deeper blue hues (`rgba(2, 132, 199, 0.8)`) with higher line weights.
  - **SVG Icons & Gradients**: Ensure linear and radial gradients inside SVG weather icons maintain adequate luminance contrast against the card background (e.g., darker cloud gradients on white surfaces, rich golden sun rays).

## 3. Local Verification Fallback
- When headless browser automation tools (like Playwright) are unavailable or encounter binary download issues, verify local servers and assets using Python:
  - Serve locally via `python -m http.server <port>`.
  - Validate endpoints and status codes (HTTP 200) using `python -c "import urllib.request; ..."`.
