import { Caption } from '..';
import type { TGameListItem } from '../../services';
import { distanceToNow } from '../../utils';

export interface CardFooterProps {
  game: TGameListItem;
}

export function CardFooter({ game }: CardFooterProps) {
  return (
    <Caption>
      {game.status === 'pending'
        ? `skapad för ${distanceToNow(game.createdAt)}`
        : `uppdaterad för ${distanceToNow(game.updatedAt)}`}
    </Caption>
  );
}
