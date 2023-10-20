import { compareDesc } from 'date-fns';
import { GameListItem } from '../services';

/**
 * Used to sort on some condition + date desc
 */

export const multiSort = ({
  a,
  b,
  condition,
}: {
  a: GameListItem;
  b: GameListItem;
  condition: (item: GameListItem) => boolean;
}) => {
  // Check if a or b is waiting for logged in user turn
  const aWaiting = condition(a);
  const bWaiting = condition(b);

  // If both are waiting or neither are waiting, sort by date
  if (aWaiting === bWaiting) {
    return compareDesc(new Date(a.updatedAt), new Date(b.updatedAt));
  }

  // If a is waiting, it should come first
  if (aWaiting) {
    return -1;
  }

  // If b is waiting, it should come first
  return 1;
};
