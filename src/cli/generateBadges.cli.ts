#!/usr/bin/env node
import { displayError, displaySuccess } from '@logic/console/console.messages';
import { generateBadges } from '@logic/generation/generateBadges.logic';

import { validateArguments } from './args/validate-arguments';

/* istanbul ignore file */

(async (): Promise<void> => {
  try {
    const { coverageSummaryPath, outputPath, logo } = validateArguments();

    await generateBadges(coverageSummaryPath, outputPath, logo);

    displaySuccess(coverageSummaryPath);
    process.exit(0);
  } catch (err) {
    displayError(err);
    process.exit(1);
  }
})();
