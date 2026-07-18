import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import createCommand from "./commands/create.js";
import { error } from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = fs.readJsonSync(packageJsonPath);

const program = new Command();

program
  .name("imksh")
  .description("A production-ready CLI for scaffolding modern applications.")
  .version(packageJson.version);

program
  .command("create")
  .description("Create a new project")
  .argument("<project-name>", "Name of the project")
  .option(
    "-t, --template <template>",
    "Template to use (react, react-ts, node, node-ts, node-prisma, node-prisma-ts, mern, mern-ts, next, next-ts, react-native, mern-react-native)",
  )
  .option("--skip-install", "Skip installing dependencies")
  .option("--no-git", "Skip initializing a git repository")
  .option("-y, --yes", "Use default options")
  .action(async (projectName, options) => {
    try {
      await createCommand(projectName, options);
    } catch (err) {
      error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
