# Guide: Publishing the Rich Text Editor as an NPM Package

If you want to extract this `RichTextEditor` component from your current project and publish it as a standalone, reusable npm package for other projects, follow this step-by-step guide.

## 1. Project Initialization

First, create a new directory for your package outside of your current project (or in a monorepo workspace) and initialize it.

```bash
mkdir my-react-lexical-editor
cd my-react-lexical-editor
npm init -y
```

## 2. Install Dependencies

You need to define your `peerDependencies` (dependencies the host app must provide) and `devDependencies` (tools to build the package).

**Dev Dependencies (Build tools & Types):**
```bash
npm install -D typescript tsup @types/react @types/react-dom @types/prismjs
```
*(We recommend using `tsup` for bundling as it is zero-config and handles TypeScript and CSS out of the box).*

**Dependencies:**
You need to install the actual editor dependencies.
```bash
npm install lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link @lexical/code @lexical/table @lexical/html @lexical/selection @lexical/utils @lexical/markdown prismjs lucide-react
```

## 3. Configure `package.json`

Modify your `package.json` to expose the bundled files, types, and correctly mark `react` and `react-dom` as peer dependencies so you don't bundle them into your package.

```json
{
  "name": "my-react-lexical-editor",
  "version": "1.0.0",
  "description": "A reusable Lexical Rich Text Editor for React",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": [
    "**/*.css"
  ],
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/index.css"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "files": [
    "dist"
  ],
  "keywords": [
    "react",
    "lexical",
    "rich-text-editor"
  ],
  "author": "Your Name",
  "license": "MIT"
}
```

## 4. Setup TypeScript

Create a `tsconfig.json` in the root:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "jsx": "react-jsx",
    "declaration": true,
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

## 5. Configure Bundler (`tsup.config.ts`)

Create a `tsup.config.ts` file in the root to tell `tsup` how to build your library.

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'], // Don't bundle React!
  injectStyle: false, // Extract CSS to a separate file (index.css)
});
```

## 6. Copy the Component Files

1. Create a `src/` directory in your new package folder.
2. Copy all the contents of your current `RichTextEditor/` folder into the `src/` directory.
3. Rename your main entry point (e.g., create an `index.ts` file in `src/`).

**`src/index.ts`:**
```typescript
import './RichTextEditor.css'; // Make sure CSS is imported so the bundler catches it

export { default as RichTextEditor } from './RichTextEditor';
export * from './types'; // Export your types if users need them
```

## 7. Build the Package

Run the build command to generate the `dist/` folder:

```bash
npm run build
```
You should see `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`, and crucially, `dist/index.css`.

## 8. Test Locally (Before Publishing)

Before publishing to NPM, you can test the package locally in another project.

In your library folder:
```bash
npm link
```

In your host application folder:
```bash
npm link my-react-lexical-editor
```
Then import it in your host app:
```tsx
import { RichTextEditor } from 'my-react-lexical-editor';
import 'my-react-lexical-editor/style.css'; // Don't forget the CSS!
```

## 9. Publish to NPM

Once you are satisfied, log in to NPM and publish!

```bash
npm login
npm publish
```

### Important Tips for the CSS:
Because this editor relies heavily on custom CSS and container queries (`RichTextEditor.css`), your users **must** import the CSS file in their app. By exposing `"./style.css": "./dist/index.css"` in your `package.json` exports, users can easily import it via `import 'my-react-lexical-editor/style.css'`.
