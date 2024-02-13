import axios from 'axios';
import { Effect } from 'effect';
import { writeFile } from 'fs-extra';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { defaultIcon, defaultOutputDir } from '@constants';

import { getBadgeUrl } from '@logic/badges/badgeUrl.logic';
import { coverageSummaryFileContentMock, mockConsole } from 'tests';

import { generateCoverageFile } from './generateCoverageFile.logic';

vi.mock('axios');
vi.mock('fs-extra', () => ({
  writeFile: vi.fn(),
}));
vi.mock('@logic/badges/badgeUrl.logic');

describe('generateCoverageFile function', () => {
  mockConsole({
    info: vi.fn(),
    error: vi.fn(),
  });

  const summary = coverageSummaryFileContentMock();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should short circuit if there is no badge url', async () => {
    vi.mocked(getBadgeUrl).mockReturnValueOnce(undefined);

    await Effect.runPromise(
      generateCoverageFile(summary, defaultOutputDir, defaultIcon)('functions'),
    );

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should not write the file if there is no data', async () => {
    vi.mocked(getBadgeUrl).mockReturnValueOnce('yolo');
    vi.mocked(axios.get).mockResolvedValueOnce({ data: '' });

    await Effect.runPromise(
      generateCoverageFile(summary, defaultOutputDir, defaultIcon)('functions'),
    );

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should write the file', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: 'yolo' });
    vi.mocked(writeFile).mockImplementationOnce(() => Promise.resolve());
    vi.mocked(getBadgeUrl).mockReturnValueOnce('yolo');

    await Effect.runPromise(
      generateCoverageFile(summary, defaultOutputDir, defaultIcon)('functions'),
    );

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
