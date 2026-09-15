#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <image-reference>" >&2
  exit 64
fi

image_ref="$1"
compose=(docker compose --project-name fe-lumbung-mesari-staging --env-file .env.staging -f docker-compose.staging.yml)

if [[ ! -f .env.staging ]]; then
  echo 'Staging deployment failed: .env.staging is missing.' >&2
  exit 78
fi

IMAGE_REF="$image_ref" "${compose[@]}" pull frontend
IMAGE_REF="$image_ref" "${compose[@]}" up -d --force-recreate frontend

for attempt in $(seq 1 30); do
  if "${compose[@]}" exec -T frontend node -e "fetch('http://127.0.0.1:3000/').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"; then
    echo "Staging frontend deployment of ${image_ref} is ready."
    exit 0
  fi
  echo "Waiting for staging frontend readiness (${attempt}/30)..." >&2
  sleep 2
done

echo "Staging frontend deployment of ${image_ref} failed readiness verification." >&2
"${compose[@]}" ps frontend >&2 || true
"${compose[@]}" logs --tail=100 frontend >&2 || true
exit 1
