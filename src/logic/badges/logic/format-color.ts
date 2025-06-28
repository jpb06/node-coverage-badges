import { Match } from 'effect';
import colors from 'picocolors';

import type { BadgeColor } from './badge-color.logic.js';

export const formatColor = (color: BadgeColor) =>
  Match.value(color).pipe(
    Match.when('red', () => colors.redBright(color)),
    Match.when('yellow', () => colors.yellowBright(color)),
    Match.orElse(() => colors.greenBright(color)),
  );
