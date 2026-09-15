# VPS Staging Frontend Image Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Deploy the Nuxt SSR frontend to the VPS as an immutable, isolated staging container whenever a reviewed PR merges to `main`.

**Architecture:** Build Nuxt into `.output` in a Node 24 multi-stage image. On a push to `main`, GitHub Actions publishes `ghcr.io/wipramgamurci/fe-lumbung-mesari:staging-<sha>` and deploys its immutable digest to `~/apps/fe-lumbung-mesari-staging`. Compose binds only `127.0.0.1:3002`; Caddy routes `staging.lumbung-mesari.app` to it. Runtime config uses `NUXT_PUBLIC_API_BASE_URL=https://staging-api.lumbung-mesari.app`.

**Files:**
- Create: `.dockerignore`, `Dockerfile`, `docker-compose.staging.yml`, `.env.staging.example`
- Create: `deployment/deploy-staging.sh`, `deployment/caddy/staging.lumbung-mesari.app.caddy`
- Create: `.github/workflows/deploy-staging.yml`, `docs/deployment/vps-staging.md`

**Verification:**
1. `npm ci && npm run build`
2. `docker build -t fe-lumbung-mesari:verify .`
3. Resolve Compose with a temporary `.env.staging`; assert project name, port `3002`, and immutable image reference.
4. `bash -n deployment/deploy-staging.sh`; its no-argument form must exit 64.
5. Assert workflow triggers `main`, publishes a SHA tag, passes its build digest, and pins the VPS checkout to `${{ github.sha }}`.

**Constraints:** Never run Nuxt dev mode on VPS. Do not deploy from this PR, create live Caddy configuration, or use backend/production credentials. Keep the public production frontend and its future deployment separate.
