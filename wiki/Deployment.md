# Deployment

The CME frontend is a Vite single-page application. Production deployment should build static files and serve them with SPA fallback routing.

## Build Command

```bash
npm run build
```

Build output:

```text
dist/
```

## Netlify Deployment

The repository includes `netlify.toml` with SPA fallback redirects:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Recommended Netlify settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18 or newer |

## PWA Support

PWA support is configured in `vite.config.js` with `vite-plugin-pwa`.

Current behavior:

- `registerType: autoUpdate`
- `injectRegister: script`

The public manifest is in:

```text
public/manifest.json
```

Manifest app name:

```text
CME Portal
```

## Backend Configuration

The current API URL is hardcoded in:

```text
src/services/axiosinstance.js
```

For deploy previews, staging, and production environments, prefer moving the base URL to an environment variable:

```text
VITE_API_BASE_URL=https://api.example.com
```

Then configure it per hosting environment.

## Deployment Checklist

- Run `npm install`.
- Run `npm run lint`.
- Run `npm run build`.
- Confirm `dist/` is generated.
- Confirm SPA fallback redirects are configured.
- Confirm backend API URL is correct for the target environment.
- Confirm PWA manifest icon paths exist in `public/`.
- Smoke test `/`, `/doctors`, `/profile`, and `/organizer` after deployment.
