import { vi, MockInstance } from 'vitest';

export const spyOnProcessExit = (): MockInstance =>
  vi
    .spyOn(process, 'exit')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .mockImplementation((() => {}) as (code?: number | undefined) => never);
