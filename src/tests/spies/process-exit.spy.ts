import { type MockInstance, vi } from 'vitest';

export const spyOnProcessExit = (): MockInstance =>
  vi
    .spyOn(process, 'exit')
    // biome-ignore lint/suspicious/noEmptyBlockStatements: tests
    .mockImplementation((() => {}) as never);
