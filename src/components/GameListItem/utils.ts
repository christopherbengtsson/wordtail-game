import { TGameListItem } from '../../services';

export const getCardTitle = (game: TGameListItem, userId: string) => {
  if (game.status === 'pending' && game.waitingForUsers.includes(userId)) {
    return 'New invitation!';
  }

  return game.name;
};

export const getCardSubtitle = (game: TGameListItem, userId: string) => {
  if (game.status === 'active') {
    if (game.currentTurnProfileId === userId) {
      return 'Your turn';
    }
    return `Waiting for ${game.currentTurnUsername}`;
  } else if (game.status === 'pending') {
    return 'Waiting for players to accept';
  } else if (game.status === 'abandoned') {
    return 'Not enough users accepted';
  }

  return `${game.winnerUsername} won`;
};
