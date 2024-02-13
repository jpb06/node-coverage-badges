import { describe, it, expect } from 'vitest';

import { getBadgeColor } from './badgeColor.logic';

describe('getBadgeColor function', () => {
  it('should return red', () => {
    const result = getBadgeColor(70);

    expect(result).toBe('red');
  });

  it('should return yellow', () => {
    const result = getBadgeColor(80);

    expect(result).toBe('yellow');
  });

  it('should return green', () => {
    const result = getBadgeColor(90);

    expect(result).toBe('brightgreen');
  });
});
