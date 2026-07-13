import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom'], // Don't bundle React!
  injectStyle: false, // Extract CSS to a separate file (index.css)
});