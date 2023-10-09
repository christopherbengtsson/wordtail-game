import { makeAutoObservable } from 'mobx';
import { GameService, TGameList, TGameListItem, TMoveType } from '../services';
import { AuthStore } from '.';
import { multiSort } from '../utils';

export class GameStore {
  private authStore: AuthStore;
  private gameService: GameService;

  constructor(authStore: AuthStore, gameService: GameService) {
    makeAutoObservable(this);

    this.authStore = authStore;
    this.gameService = gameService;
  }

  async fetchGames() {
    return this.gameService.fetchGames();
  }

  async getGameById(id?: string) {
    if (id) {
      return this.gameService.getGameById(id);
    }
  }

  async createGame(params: {
    name: string;
    players: string[];
    maxNumberOfMarks: number;
  }) {
    const res = await this.gameService.createGame(params);
    if (res.error) {
      throw res.error;
    }

    return res;
  }

  async handleGameInvitation(params: { gameId: string; accept: boolean }) {
    return this.gameService.handleGameInvitation(params);
  }

  async handleGameMove({
    gameId,
    gameMove,
    letter,
  }: {
    gameId: string;
    gameMove: TMoveType;
    letter?: string;
  }) {
    switch (gameMove) {
      case 'add_letter':
        return this.gameService.addLetter({ gameId, letter });
      case 'call_bluff':
        throw new Error('Not implemented');
      case 'call_finished_word':
        throw new Error('Not implemented');
    }
  }

  sortActiveGames(games: TGameList) {
    return games
      .filter((game) => game.status === 'active')
      .sort((a, b) =>
        multiSort({
          a,
          b,
          condition: (item: TGameListItem) =>
            item.currentTurnProfileId === this.authStore.userId,
        }),
      );
  }
  sortPendingGames(games: TGameList) {
    return games
      .filter((game) => game.status === 'pending')
      .sort((a, b) =>
        multiSort({
          a,
          b,
          condition: (item: TGameListItem) =>
            item.waitingForUsers.includes(this.authStore.userId),
        }),
      );
  }
  sortFinishedGames(games: TGameList) {
    return games.filter(
      (game) => game.status === 'abandoned' || game.status === 'finished',
    );
  }
  getNumberOfInvites(pendingGames: TGameList) {
    return pendingGames.filter(({ waitingForUsers }) =>
      waitingForUsers?.includes(this.authStore.userId),
    ).length;
  }
}
