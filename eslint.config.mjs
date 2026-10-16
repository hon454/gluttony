import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "node_modules/",
    ".wrangler/",
    ".artifacts/",
    "coverage/",
    "worker-configuration.d.ts",
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
);
