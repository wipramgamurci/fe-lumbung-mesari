#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <image-reference>" >&2
  exit 64
fi

: "${GHCR_TOKEN:?GHCR_TOKEN must be provided by the staging workflow}"
: "${GHCR_USERNAME:?GHCR_USERNAME must be provided by the staging workflow}"

image_ref="$1"
# IMAGE_REF is deployment input for every Compose invocation, not application
# configuration persisted in .env.
export IMAGE_REF="$image_ref"
compose=(docker compose --project-name fe-lumbung-mesari-staging --env-file .env -f docker-compose.staging.yml)

if [[ ! -f .env ]]; then
  echo 'Staging deployment failed: .env is missing.' >&2
  exit 78
fi

trap 'docker logout ghcr.io >/dev/null 2>&1 || true' EXIT

printf '%s' "$GHCR_TOKEN" | docker login ghcr.io --username "$GHCR_USERNAME" --password-stdin

previous_image_ref=''
mapfile -t previous_image_ids < <("${compose[@]}" images -q frontend)
if [[ -n "${previous_image_ids[0]:-}" ]]; then
  previous_image_ref=$(docker image inspect --format '{{index .RepoDigests 0}}' "${previous_image_ids[0]}" 2>/dev/null || true)
  [[ "$previous_image_ref" == '<no value>' ]] && previous_image_ref=''
fi

"${compose[@]}" pull frontend
"${compose[@]}" up -d --force-recreate frontend

wait_for_readiness() {
  local deployed_image_ref="$1"

  for attempt in $(seq 1 30); do
    if "${compose[@]}" exec -T frontend node -e "fetch('http://127.0.0.1:3000/').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"; then
      echo "Staging frontend deployment of ${deployed_image_ref} is ready."
      return 0
    fi
    echo "Waiting for staging frontend readiness (${attempt}/30)..." >&2
    sleep 2
  done

  return 1
}

if wait_for_readiness "$image_ref"; then
  exit 0
fi

echo "Staging frontend deployment of ${image_ref} failed readiness verification." >&2
"${compose[@]}" ps frontend >&2 || true
"${compose[@]}" logs --tail=100 frontend >&2 || true

if [[ -n "$previous_image_ref" ]]; then
  echo "Restoring previous staging frontend image ${previous_image_ref}." >&2
  export IMAGE_REF="$previous_image_ref"
  "${compose[@]}" pull frontend
  "${compose[@]}" up -d --force-recreate frontend
  if ! wait_for_readiness "$previous_image_ref"; then
    echo "Rollback frontend image ${previous_image_ref} also failed readiness verification." >&2
    "${compose[@]}" logs --tail=100 frontend >&2 || true
  fi
fi

exit 1
