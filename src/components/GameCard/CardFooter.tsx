import { Caption } from '..';
import type { GameListItem } from '../../services';
import { distanceToNow } from '../../utils';

export interface CardFooterProps {
  game: GameListItem;
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
