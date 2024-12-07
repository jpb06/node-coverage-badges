import { generateBadgesFromValues } from './../logic/generation/generate-badges-from-values.logic.js';

generateBadgesFromValues({
  total: {
    branches: {
      pct: 25,
    },
    functions: {
      pct: 40,
    },
    lines: {
      pct: 30,
    },
    statements: {
      pct: 70,
    },
  },
});
