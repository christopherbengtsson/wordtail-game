import { makeAutoObservable } from 'mobx';
import { GameService, TGameList, TMoveType } from '../services';
import { AuthStore } from '.';
import { compareDesc } from 'date-fns';

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
    return games.filter((game) => game.status === 'active');
  }
  sortPendingGames(games: TGameList) {
    return games
      .filter((game) => game.status === 'pending')
      .sort((a, b) => {
        // Check if a or b is waiting for the user
        const aWaiting = a.waitingForUsers.includes(this.authStore.userId);
        const bWaiting = b.waitingForUsers.includes(this.authStore.userId);

        // If both are waiting or neither are waiting, sort by date
        if (aWaiting === bWaiting) {
          return compareDesc(new Date(a.createdAt), new Date(b.createdAt));
        }

        // If a is waiting, it should come first
        if (aWaiting) {
          return -1;
        }

        // If b is waiting, it should come first
        return 1;
      });
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
