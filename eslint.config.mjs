import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Runtime gerado pelo editor do hi-fi: referência de design, não código
    // do projeto (AGENTS.md §3).
    "specs/design-reference/**",
    // Servido estático, roda no browser fora do bundle.
    "public/verify.js",
  ]),
  {
    // Código do registry do shadcn, mantido como veio (plan.md §3). O
    // `carousel` sincroniza com a API do Embla dentro de um efeito, padrão que
    // a regra do Next reprova e que não se corrige sem divergir do preset.
    files: ["src/components/ui/**"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
]);

export default eslintConfig;
