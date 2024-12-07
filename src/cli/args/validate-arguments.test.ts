import { existsSync } from 'node:fs';
import colors from 'picocolors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultIcon } from '@constants';
import { runCommand } from '@tests';
import { mockConsole } from '@tests/mocks';
import { spyOnProcessExit } from '@tests/spies';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

describe('validateArguments function', () => {
  const validateArgumentsPath = './../cli/args/validate-arguments';

  mockConsole({
    error: vi.fn(),
  });
  const mockExit = spyOnProcessExit();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display an error when coverage summary file does not exist', async () => {
    vi.mocked(existsSync).mockReturnValueOnce(false);

    await runCommand(validateArgumentsPath);

    expect(mockExit).toHaveBeenCalled();

    expect(console.error).toHaveBeenCalledWith(
      colors.bold(
        colors.redBright(
          `Errors:\n-c\t\tCoverage file ./coverage/coverage-summary.json doesn't exist\n`,
        ),
      ),
    );
  });

  it('should return default values', async () => {
    vi.mocked(existsSync).mockReturnValueOnce(true);

    const args = await runCommand(validateArgumentsPath);

    expect(args).toStrictEqual({
      coverageSummaryPath: './coverage/coverage-summary.json',
      outputPath: './badges',
      logo: defaultIcon,
    });
  });

  it('should return a custom json summary file path', async () => {
    vi.mocked(existsSync).mockReturnValueOnce(true);

    const path = './libs/graphql/react-query.codeden.yml';
    const args = await runCommand(validateArgumentsPath, '-c', path);

    expect(args).toStrictEqual({
      coverageSummaryPath: path,
      outputPath: './badges',
      logo: defaultIcon,
    });
  });

  it('should return a custom output path', async () => {
    vi.mocked(existsSync).mockReturnValueOnce(true);

    const path = './cool';
    const args = await runCommand(validateArgumentsPath, '-o', path);

    expect(args).toStrictEqual({
      coverageSummaryPath: './coverage/coverage-summary.json',
      outputPath: path,
      logo: defaultIcon,
    });
  });

  it('should return a custom logo', async () => {
    vi.mocked(existsSync).mockReturnValueOnce(true);

    const logo = 'vitest';
    const args = await runCommand(validateArgumentsPath, '-l', logo);

    expect(args).toStrictEqual({
      coverageSummaryPath: './coverage/coverage-summary.json',
      outputPath: './badges',
      logo,
    });
  });
});
