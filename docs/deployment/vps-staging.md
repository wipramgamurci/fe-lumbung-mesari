# VPS staging frontend

The Nuxt frontend is deployed as a Node/Nitro SSR container, not `nuxt dev` or a host Node process.

| Environment | Compose project | Loopback port | API runtime URL |
| --- | --- | --- | --- |
| Staging frontend | `fe-lumbung-mesari-staging` | `127.0.0.1:3002` | `https://staging-api.lumbung-mesari.app` |

A merge to `main` publishes `ghcr.io/wipramgamurci/fe-lumbung-mesari:staging-<sha>` and deploys the immutable digest to `~/apps/fe-lumbung-mesari-staging`.

## One-time VPS setup

```bash
cd ~/apps/fe-lumbung-mesari-staging
cp .env.staging.example .env.staging
chmod 600 .env.staging
```

Set `NUXT_PUBLIC_API_BASE_URL` to the staging API domain. It is public runtime configuration, not a secret.

Copy `deployment/caddy/staging.lumbung-mesari.app.caddy` to `/etc/caddy/sites/`, validate, then reload Caddy:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

This PR does not create live DNS, Caddy, or container state.

## Verification

```bash
curl --fail http://127.0.0.1:3002/
curl --fail https://staging.lumbung-mesari.app/
```
