import { type MockInstance, vi } from 'vitest';

export const spyOnProcessExit = (): MockInstance =>
  vi
    .spyOn(process, 'exit')
    // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
    .mockImplementation((() => {}) as never);
