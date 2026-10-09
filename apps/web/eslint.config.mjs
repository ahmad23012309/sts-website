import next from "eslint-config-next";

/**
 * Next 16 dropped `next lint`, so the config lives here and eslint runs
 * directly. eslint-config-next already exports a flat config array covering
 * the framework's recommended rules and its Core Web Vitals checks.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "src/lib/cms/settings.generated.ts",
    ],
  },
  ...next,
];

export default config;
