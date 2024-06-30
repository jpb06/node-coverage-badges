import { generateBadgesFromValues } from '@logic/generation/generateBadgesFromValues.logic';

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
