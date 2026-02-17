/**
 * Load .env.local and .env before any other script code runs.
 * Must be imported first in scripts that need env vars (e.g. ingest-ai-tools.ts).
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
