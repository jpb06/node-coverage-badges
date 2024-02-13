import chalk from 'chalk';
import { pathExistsSync } from 'fs-extra';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { defaultOutputDir, defaultSummaryPath, defaultIcon } from '@constants';

import { GenerateBadgesArguments } from '../types/args.type';

interface CliArguments {
  c: string;
  o: string;
  l: string;
}

export const validateArguments = (): GenerateBadgesArguments => {
  const argv = yargs(hideBin(process.argv))
    .scriptName('generateBadges')
    .usage(
      chalk.blueBright(
        '$0 -c [coverageJsonSummaryPath] -o [outputPath] -l [logo]',
      ),
    )
    .epilogue('Generates badges from a coverage report')
    .example('$0 -c ./coverage/coverage-summary.json -o ./badges -l vitest', '')
    .describe('c', chalk.cyanBright('coverage file path'))
    .describe('o', chalk.cyanBright('output path'))
    .describe('l', chalk.cyanBright('vitest'))
    .default('c', defaultSummaryPath)
    .default('o', defaultOutputDir)
    .default('l', defaultIcon, '<default icon>')
    .check((args) => {
      const coverageFileExists = pathExistsSync(args.c);
      if (!coverageFileExists) {
        throw new Error(
          chalk.bold.redBright(
            `Errors:\n-c\t\tCoverage file ${args.c} doesn't exist\n`,
          ),
        );
      }

      return true;
    }).argv as CliArguments;

  return {
    coverageSummaryPath: argv.c,
    outputPath: argv.o,
    logo: argv.l,
  };
};
