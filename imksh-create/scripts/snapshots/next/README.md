# IMKSH Next.js App Router Template

This is a starter template for Next.js applications created with `imksh-create`. It comes pre-configured with the modern App Router, Tailwind CSS, Framer Motion, Zustand, Axios, FlyonUI, and PWA support.

## Getting Started

### 1. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

*(Note: Use `--legacy-peer-deps` if you encounter any dependency resolution issues during the initial install).*

### 2. Environment Variables

Create a `.env.local` file in the root of your project to specify your backend API URL. If not provided, it defaults to `http://localhost:5001/api`.

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features Included

- **Next.js App Router**: Modern routing structure (`src/app`).
- **Tailwind CSS & FlyonUI**: Pre-configured utility-first styling with beautiful UI components.
- **Framer Motion**: Ready to use for smooth animations and transitions.
- **Zustand**: Lightweight global state management (e.g., `useAuthStore`, `useUiStore`).
- **Axios**: Configured API client with interceptors (`src/config/api.js`).
- **PWA Ready**: Integrated `@ducanh2912/next-pwa` with a configured `manifest.json`.
- **Smooth Scrolling**: Lenis smooth scrolling integrated via the `useLenis` hook.
- **API Routes**: Configured Next.js Route Handlers (e.g. `src/app/api/hello/route.js`).
- **Proxy setup**: `next.config.mjs` is configured to proxy `/api/:path*` requests to your backend port.

## Project Structure

- `src/app`: Contains all pages, layouts, and API routes.
- `src/components`: Reusable UI components (common, layout, modals, ui).
- `src/config`: App configuration and Axios instance.
- `src/hooks`: Custom React hooks.
- `src/services`: API service functions.
- `src/store`: Zustand global state management.
- `src/utils`: Helper utility functions.
- `public`: Static assets like icons and the PWA manifest.

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```
