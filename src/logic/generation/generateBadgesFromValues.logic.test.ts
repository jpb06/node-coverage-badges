import { Effect } from 'effect';
import { readdir, ensureDir, readJson, rm } from 'fs-extra';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { defaultIcon, defaultOutputDir } from '@constants';
import { mockConsole } from '@tests';

import {
  CoverageSummaryValue,
  generateBadgesFromValues,
} from './generateBadgesFromValues.logic';
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

describe('generateBadgesFromValues function', () => {
  const rawValues: CoverageSummaryValue = {
    total: {
      branches: { pct: 10 },
      functions: { pct: 20 },
      lines: { pct: 30 },
      statements: { pct: 40 },
    },
  };

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

    await generateBadgesFromValues(rawValues, defaultOutputDir, defaultIcon);

    expect(ensureDir).toHaveBeenCalledTimes(1);
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(rm).toHaveBeenCalledTimes(2);
  });

  it('should generate all badges', async () => {
    await generateBadgesFromValues(rawValues, defaultOutputDir, defaultIcon);

    expect(generateCoverageFileCurry).toHaveBeenCalledTimes(5);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
