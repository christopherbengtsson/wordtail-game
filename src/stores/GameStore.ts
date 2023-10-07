import { makeAutoObservable } from 'mobx';
import { GameService, TGameList } from '../services';
import { AuthStore } from '.';

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

  get invites() {
    return this.games.filter(
      (game) =>
        game.status === 'pending' &&
        this.authStore.userId &&
        game.waitingForUsers.includes(this.authStore.userId),
    );
  }

  get history() {
    return this.games.filter(
      (game) => game.status === 'abandoned' || game.status === 'finished',
    );
  }

  async fetchGames() {
    const response = await this.gameService.fetchGames();
    this.setGamesState(response.data as TGameList);
    return response;
  }

  async getGameById(id: string) {
    return this.gameService.getGameById(id);
  }

  async createGame(params: { name: string; players: string[] }) {
    return this.gameService.createGame(params);
  }

  async handleGameInvitation(params: { gameId: string; accept: boolean }) {
    return this.gameService.handleGameInvitation(params);
  }

  private setGamesState(games: TGameList) {
    this.games = games;
  }
}
