import { Match } from 'effect';

export type BadgeColor = 'red' | 'yellow' | 'brightgreen';

export const getBadgeColor = (percentage: number): BadgeColor =>
  Match.value(percentage).pipe(
    Match.when(
      (v) => v < 80,
      () => 'red' as const,
    ),
    Match.when(
      (v) => v < 90,
      () => 'yellow' as const,
    ),
    Match.orElse(() => 'brightgreen' as const),
  );
