import { match, P } from 'ts-pattern';

type BadgeColor = 'red' | 'yellow' | 'brightgreen';

export const getBadgeColor = (percentage: number): BadgeColor =>
  match<number, BadgeColor>(percentage)
    .with(
      P.when((v) => v < 80),
      () => 'red',
    )
    .with(
      P.when((v) => v < 90),
      () => 'yellow',
    )
    .otherwise(() => 'brightgreen');
