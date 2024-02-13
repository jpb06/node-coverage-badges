import { Mock, vi } from 'vitest';

interface ChalkMockArgs {
  cyanBright?: Mock;
  greenBright?: Mock;
  redBright?: Mock;
  whiteBright?: Mock;
  underline?: {
    cyanBright?: Mock;
  };
}

export const mockChalk = (args: ChalkMockArgs) => {
  vi.doMock('chalk', async () => ({ default: args, ...args }));
};
