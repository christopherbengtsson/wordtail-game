import { formatDistanceToNow } from 'date-fns';
import { Caption } from '..';
import type { TGameListItem } from '../../services';

export interface CardFooterProps {
  game: TGameListItem;
}

export function CardFooter({ game }: CardFooterProps) {
  return (
    <Caption>
      {game.status === 'pending'
        ? `Game created ${formatDistanceToNow(new Date(game.createdAt))} ago`
        : `Round updated ${formatDistanceToNow(new Date(game.updatedAt))} ago`}
    </Caption>
  );
}
