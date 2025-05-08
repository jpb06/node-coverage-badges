import { existsSync } from 'node:fs';

import colors from 'picocolors';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import {
  defaultIcon,
  defaultLabelPrefix,
  defaultOutputDir,
  defaultSummaryPath,
} from '@constants';

import type { GenerateBadgesArguments } from '../types/args.type.js';

interface CliArguments {
  c: string;
  o: string;
  l: string;
  p: string;
}

export const validateArguments = (): GenerateBadgesArguments => {
  const argv = yargs(hideBin(process.argv))
    .scriptName('generateBadges')
    .usage(
      colors.blueBright(
        '$0 -c [coverageJsonSummaryPath] -o [outputPath] -l [logo]',
      ),
    )
    .epilogue('Generates badges from a coverage report')
    .example('$0 -c ./coverage/coverage-summary.json -o ./badges -l vitest', '')
    .describe('c', colors.cyanBright('coverage file path'))
    .describe('o', colors.cyanBright('output path'))
    .describe('l', colors.cyanBright('vitest'))
    .describe('p', colors.cyanBright('badges label prefix'))
    .default('c', defaultSummaryPath)
    .default('o', defaultOutputDir)
    .default('l', defaultIcon, '<default icon>')
    .default('p', defaultLabelPrefix)
    .check((args) => {
      const coverageFileExists = existsSync(args.c);
      if (!coverageFileExists) {
        throw new Error(
          colors.bold(
            colors.redBright(
              `Errors:\n-c\t\tCoverage file ${args.c} doesn't exist\n`,
            ),
          ),
        );
      }

      if (args.p.includes('-')) {
        throw new Error(
          colors.bold(
            colors.redBright(
              `Errors:\n-p\t\tLabel prefix '${args.p}' should not contain character '-'\n`,
            ),
          ),
        );
      }

      return true;
    }).argv as CliArguments;

  return {
    coverageSummaryPath: argv.c,
    outputPath: argv.o,
    logo: argv.l,
    labelPrefix: argv.p,
  };
};
