/* eslint-disable no-console */
import axios from 'axios';
import { Effect } from 'effect';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { download } from './download.effect';

vi.mock('axios');

describe('Download function', () => {
  const url = 'https://yolo.org';
  global.console = {
    info: vi.fn(),
    error: vi.fn(),
    warn: global.console.warn,
  } as unknown as Console;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty string if an error occured', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce('Oh no!');

    const promise = Effect.runPromise(download(url));

    await expect(promise).rejects.toThrow();
  });

  it('should return the fetched data', async () => {
    const data = 'Yolo man';
    vi.mocked(axios.get).mockResolvedValueOnce({ data });

    const result = await Effect.runPromise(download(url));

    expect(result).toBe(data);
  });
});
