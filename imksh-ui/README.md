# Imksh UI

This is a monorepo containing a React UI library (`@imksh/ui`) and a playground application to test components with live updates.

## Project Structure

- `packages/ui`: The main React component library built with Vite, TypeScript, and Tailwind CSS.
- `apps/playground`: A Vite-based React application that consumes `@imksh/ui` and is used for testing.

## Getting Started

From the root of the monorepo (`imksh-ui`):

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Development (Live Updates):**
   To get live updates while developing components in the UI package, you need to run Vite in both the `ui` package and the `playground` app concurrently.

   Open two terminal windows:

   **Terminal 1 (Build UI package in watch mode):**
   ```bash
   cd packages/ui
   npm run dev
   ```

   **Terminal 2 (Start Playground app):**
   ```bash
   cd apps/playground
   npm run dev
   ```

   Now, any changes you make to the components in `packages/ui/src` will automatically trigger a rebuild, and the playground app running on `http://localhost:5173` will hot-reload to reflect your changes!

## Creating New Components

1. Add your new component in `packages/ui/src/components/YourComponent.tsx`.
2. Export it from `packages/ui/src/index.ts`.
3. Import and use it in `apps/playground/src/App.tsx` to test it.

## Publishing

To publish the UI package, navigate to `packages/ui`, bump the version in `package.json`, build the package, and run `npm publish`:

```bash
cd packages/ui
npm run build
npm publish --access public
```
