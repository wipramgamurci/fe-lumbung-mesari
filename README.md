# Lumbung Mesari Frontend

A Nuxt.js frontend application for Lumbung Mesari cooperative management system.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Environment Configuration

The application uses environment-based API configuration. Create a `.env` file in the root directory:

```bash
# Development (default)
API_BASE_URL=http://localhost:8000

# Production
API_BASE_URL=https://api.yourdomain.com
```

If no `.env` file is provided, it defaults to `http://localhost:8000` for development.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
