# @imksh/create

A production-ready Node.js CLI tool to scaffold modern applications quickly. Built with ES Modules, Commander, Inquirer, Chalk, and Ora.

## Installation

You can use the CLI directly without installing via `npx` (or `pnpm dlx` / `yarn create`):

```bash
npx @imksh/create create my-app
```

Or you can install it globally:

```bash
npm install -g @imksh/create
```

## Usage

Create a new project using the interactive prompt:

```bash
imksh create my-app
```

### Options

- `--template <template-name>`: Bypass the interactive prompt and specify the template directly.
- `--skip-install`: Skip the automatic installation of dependencies.
- `--no-git`: Skip initializing a git repository.
- `--yes`: Use default options for everything without prompting.

### Examples

```bash
# Interactive mode
imksh create my-app

# Specify template directly
imksh create my-app --template react-ts

# Skip installing dependencies
imksh create my-app --template next --skip-install
```

## Available Templates

- `react`: Vite, React, React Router, Axios, TailwindCSS, Lucide.
- `react-ts`: Same as `react`, but with TypeScript.
- `node`: Express, security middlewares, separated `app.js`/`index.js` architecture, custom colorized logger, JWT, Rate Limiter, Socket.io scaffolding, web-push subscriptions, SMTP OTP mailer, and Cloudinary uploads.
- `node-ts`: Same as `node`, but with TypeScript, global request type extensions (`src/types/express.d.ts`), and powered by `tsx` (TypeScript Execute) runtime.
- `node-prisma`: Node.js template with Prisma ORM setup, mapping relational models for Users, OTPs, and push subscriptions.
- `node-prisma-ts`: Same as `node-prisma`, but with TypeScript and `tsx` configuration.
- `mern`: Full-stack React client + Express/Node server incorporating the new modular structure.
- `mern-ts`: Full-stack React client (TS) + Express/Node server (TS) incorporating the new modular structure.
- `next`: Next.js App Router boilerplate.
- `next-ts`: Next.js App Router boilerplate with TypeScript.

## Adding Templates

To add a new template, simply create a new folder under `templates/` with your template name and populate it with the complete boilerplate. The CLI automatically copies it when selected.

## Folder Structure

```
@imksh/create/
├── bin/          # Executable entry
├── src/          # Core CLI logic
│   ├── commands/ # CLI Commands (create, etc.)
│   └── utils/    # Helper functions
└── templates/    # Project boilerplate templates
```

## Publishing to npm

To publish this package to npm:

1. Create an npm account and log in via terminal:
   ```bash
   npm login
   ```
2. Make sure you are a member of the `@imksh` organization or it's your username.
3. Run the publish command:
   ```bash
   npm publish --access public
   ```
4. To update future versions, update the version in `package.json` (or use `npm version patch/minor/major`) and run `npm publish --access public` again.
