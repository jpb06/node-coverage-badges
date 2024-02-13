import { describe, it, beforeEach, expect, vi } from 'vitest';

import { mockChalk, mockConsole } from '@tests';

mockConsole({
  info: vi.fn(),
  error: vi.fn(),
});
mockChalk({
  cyanBright: vi.fn(),
  greenBright: vi.fn(),
  redBright: vi.fn(),
  whiteBright: vi.fn(),
  underline: {
    cyanBright: vi.fn(),
  },
});

describe('displaySuccess function', () => {
  const summaryPath = './src/api';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call console.info', async () => {
    const { displaySuccess } = await import('./console.messages');

    displaySuccess(summaryPath);

    expect(console.info).toHaveBeenCalledTimes(1);
  });

  it('should display the package name in cyan', async () => {
    const chalk = await import('chalk');
    const { displaySuccess } = await import('./console.messages');

    displaySuccess(summaryPath);

    expect(chalk.cyanBright).toHaveBeenCalledWith('node-coverage-badges');
  });

  it('should display sucess message in green and the number of handled endpoints', async () => {
    const chalk = await import('chalk');
    const { displaySuccess } = await import('./console.messages');

    displaySuccess(summaryPath);

    expect(chalk.greenBright).toHaveBeenCalledTimes(1);
    expect(chalk.greenBright).toHaveBeenCalledWith(
      'Badges generated from summary path',
    );
  });

  it('should display the outpath in cyan underlined', async () => {
    const chalk = await import('chalk');
    const { displaySuccess } = await import('./console.messages');

    displaySuccess(summaryPath);

    expect(chalk.underline.cyanBright).toHaveBeenCalledWith(summaryPath);
  });
});

describe('displayError function', () => {
  const errorMessage = 'oh no!';

  it('should call console.error', async () => {
    const { displayError } = await import('./console.messages');

    displayError({ message: errorMessage });

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should display the package name in cyan', async () => {
    const chalk = await import('chalk');
    const { displayError } = await import('./console.messages');

    displayError({ message: errorMessage });

    expect(chalk.cyanBright).toHaveBeenCalledWith('node-coverage-badges');
  });

  it('should display the error message in red', async () => {
    const chalk = await import('chalk');
    const { displayError } = await import('./console.messages');

    displayError({ message: errorMessage });

    expect(chalk.redBright).toHaveBeenCalledWith(errorMessage);
  });
});
