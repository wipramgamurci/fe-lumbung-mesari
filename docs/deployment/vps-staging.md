# VPS staging frontend

The Nuxt frontend is deployed as a Node/Nitro SSR container, not `nuxt dev` or a host Node process.

| Environment | Compose project | Loopback port | API runtime URL |
| --- | --- | --- | --- |
| Staging frontend | `fe-lumbung-mesari-staging` | `127.0.0.1:3002` | `https://staging-api.lumbung-mesari.app` |

A merge to `main` publishes `ghcr.io/wipramgamurci/fe-lumbung-mesari:staging-<sha>` and deploys the immutable digest to `~/apps/fe-lumbung-mesari-staging`.

## One-time VPS setup

```bash
git clone https://github.com/wipramgamurci/fe-lumbung-mesari.git ~/apps/fe-lumbung-mesari-staging
cd ~/apps/fe-lumbung-mesari-staging
# Before the first main merge, obtain the template from the reviewed PR branch.
git checkout feat/vps-staging-image
cp .env.example .env
chmod 600 .env
git checkout main
```

Set `NUXT_PUBLIC_API_BASE_URL=https://staging-api.lumbung-mesari.app`. It is public runtime configuration, not a secret. Each separate production/staging checkout owns its own ignored `.env` file.

Copy `deployment/caddy/staging.lumbung-mesari.app.caddy` to `/etc/caddy/sites/`. Confirm the active Caddy entrypoint imports site fragments, then validate and reload:

```bash
sudo grep -Fx 'import /etc/caddy/sites/*.caddy' /etc/caddy/Caddyfile
sudo caddy fmt --overwrite /etc/caddy/sites/staging.lumbung-mesari.app.caddy
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

This PR does not create live DNS, Caddy, or container state.

## Verification

```bash
curl --fail http://127.0.0.1:3002/
curl --fail https://staging.lumbung-mesari.app/
```
