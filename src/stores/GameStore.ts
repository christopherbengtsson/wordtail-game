import { makeAutoObservable } from 'mobx';
import { GameService } from '../services';

// TODO: Create types
export class GameStore {
  private gameService: GameService;

  constructor(gameService: GameService) {
    makeAutoObservable(this);

    this.gameService = gameService;
  }

  async fetchGames() {
    return this.gameService.fetchGames();
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
}
