import { makeAutoObservable } from 'mobx';
import { GameService } from '../services';

// TODO: Create types
export class GameStore {
  games: any[] = [];
  currentGame: any | null = null;

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

  async createGame({ name, players }: { name: string; players: string[] }) {
    return this.gameService.createGame({ name, players });
  }
}
