import { Effect } from 'effect';
import { readdir, ensureDir, readJson, rm } from 'fs-extra';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { defaultIcon, defaultOutputDir, defaultSummaryPath } from '@constants';
import { mockConsole } from '@tests';

import { generateBadges } from './generateBadges.logic';
import { generateCoverageFile } from './generateCoverageFile.logic';

vi.mock('fs-extra', () => ({
  readJson: vi.fn(),
  ensureDir: vi.fn(),
  readdir: vi.fn(),
  rm: vi.fn(),
}));
vi.mock('./generateCoverageFile.logic', () => ({
  generateCoverageFile: vi.fn(),
}));

describe('generateBadges function', () => {
  mockConsole({
    error: vi.fn(),
  });

  beforeEach(() => {
    vi.mocked(readdir).mockImplementation(() => Promise.resolve([]));
    vi.mocked(ensureDir).mockImplementation(() => Promise.resolve());
    vi.mocked(rm).mockImplementation(() => Promise.resolve());
  });

  const generateCoverageFileCurry = vi
    .fn()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .mockImplementation(() => Effect.sync(() => {}));

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(generateCoverageFile).mockImplementation(
      () => generateCoverageFileCurry,
    );
  });

  it('should ensure outDir is there and clear it', async () => {
    vi.mocked(readdir).mockResolvedValueOnce([
      'one.svg',
      'apps/front/cool.svg',
    ] as never);
    vi.mocked(readJson).mockImplementation(() => Promise.resolve());

    await generateBadges(defaultSummaryPath, defaultOutputDir, defaultIcon);

    expect(ensureDir).toHaveBeenCalledTimes(1);
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(rm).toHaveBeenCalledTimes(2);
  });

  it('should generate all badges', async () => {
    vi.mocked(readJson).mockImplementation(() => Promise.resolve());

    await generateBadges(defaultSummaryPath, defaultOutputDir, defaultIcon);

    expect(readJson).toHaveBeenCalledTimes(1);
    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should report on errors', async () => {
    const errorMessage = 'Oh no!';
    vi.mocked(readJson).mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      generateBadges(defaultSummaryPath, defaultOutputDir, defaultIcon),
    ).rejects.toThrowError('fs-error');

    expect(readJson).toHaveBeenCalledTimes(1);
    expect(generateCoverageFile).toHaveBeenCalledTimes(0);
  });

  it('should use default values', async () => {
    vi.mocked(readJson).mockImplementation(() => Promise.resolve());

    await generateBadges();

    expect(readJson).toHaveBeenCalledWith(defaultSummaryPath);
    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
  });

  it('should use custom summary path and output dir', async () => {
    vi.mocked(readJson).mockImplementation(() => Promise.resolve());

    await generateBadges(defaultSummaryPath, defaultOutputDir, defaultIcon);

    expect(readJson).toHaveBeenCalledWith(defaultSummaryPath);
    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
  });

  it('should use the summary path given as parameter', async () => {
    vi.mocked(readJson).mockImplementation(() => Promise.resolve());

    const summaryPath = 'yolo';

    await generateBadges(summaryPath, defaultOutputDir, defaultIcon);

    expect(readJson).toHaveBeenCalledWith(summaryPath);
  });
});
