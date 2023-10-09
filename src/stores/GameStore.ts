import { makeAutoObservable } from 'mobx';
import { GameService, TGameList } from '../services';
import { AuthStore } from '.';
import { compareDesc } from 'date-fns';

export class GameStore {
  private authStore: AuthStore;
  private gameService: GameService;
  games: TGameList = [];

  constructor(authStore: AuthStore, gameService: GameService) {
    makeAutoObservable(this);

    this.authStore = authStore;
    this.gameService = gameService;
  }

  get activeGames() {
    return this.games.filter((game) => game.status === 'active');
  }
  get pendingGames() {
    return this.games
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
  get finishedGames() {
    return this.games.filter(
      (game) => game.status === 'abandoned' || game.status === 'finished',
    );
  }
  get numberOfInvites() {
    return this.pendingGames.filter(({ waitingForUsers }) =>
      waitingForUsers?.includes(this.authStore.userId),
    ).length;
  }

  async fetchGames() {
    const response = await this.gameService.fetchGames();
    this.setGamesState(response.data as TGameList);
    return response;
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

  private setGamesState(games: TGameList) {
    this.games = games;
  }
}
