/** @type {import('next').NextConfig} */
const nextConfig = {
  // "standalone" produces a minimal, self-contained server bundle in
  // .next/standalone — this is what the production Dockerfile copies in.
  output: 'standalone',
  reactStrictMode: true,

  // MUI + Emotion need this so Next.js doesn't try to bundle Emotion's
  // packages in a way that breaks server-side style injection.
  transpilePackages: ['@mui/x-charts', '@mui/x-data-grid'],

  // Next.js 16 decoupled linting from `next build` (the old `eslint` config
  // key is no longer recognized here). Run `npm run lint` separately —
  // e.g. in CI, or as a pre-commit/pre-build step — instead.
};

export default nextConfig;
