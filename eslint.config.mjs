import { FlatCompat } from "@eslint/eslintrc";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import typescriptSortKeys from "eslint-plugin-typescript-sort-keys";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "jsx-a11y": jsxA11y,
      react,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
      "sort-keys-fix": sortKeysFix,
      "typescript-sort-keys": typescriptSortKeys,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false,
          prefer: "type-imports",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "no-unused-vars": "off",

      // Additional helpful rules
      "prefer-const": "error",

      // React rules
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
          shorthandFirst: true,
          shorthandLast: false,
        },
      ],

      "react/sort-default-props": "error",

      "react/sort-prop-types": "error",

      "simple-import-sort/exports": "error",

      // Import sorting
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // React and Next.js imports first
            ["^react", "^next"],
            // External packages
            ["^@?\\w"],
            // Internal packages
            ["^(@|components|utils|lib|hooks|types|styles)(/.*|$)"],
            // Parent imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Same-folder imports
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.?(css|scss|sass|less)$"],
          ],
        },
      ],

      // Object key sorting
      "sort-keys-fix/sort-keys-fix": "error",

      "typescript-sort-keys/interface": "error",

      "typescript-sort-keys/string-enum": "error",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/*.d.ts",
      ".git/**",
      "dist/**",
      "coverage/**",
    ],
  },
];

export default eslintConfig;
