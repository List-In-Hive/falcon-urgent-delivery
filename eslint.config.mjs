import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Logos are SVG and blog images come from the admin as plain files, so <img> is intentional.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".netlify/**"]),
]);

export default eslintConfig;
