import { makeAutoObservable, runInAction } from 'mobx';
import { GameService } from '../services';

export class GameStore {
  games: any[] = []; // you might want to replace 'any' with a specific type for a game
  currentGame: any | null = null; // replace 'any' with a type if available

  private gameService: GameService;

  constructor(gameService: GameService) {
    makeAutoObservable(this);

    this.gameService = gameService;
  }

  // Fetch all games for a user
  async fetchGames() {
    try {
      const games = await this.gameService.fetchGames();
      console.log('Games (GameStore)', games);
      runInAction(() => {
        this.games = games;
      });
    } catch (error) {
      console.error('Failed to fetch games:', error);
      // handle error, possibly set some state to reflect the error in the UI
    }
  }

  // Create a new game
  async createGame({ name, players }: { name: string; players: string[] }) {
    try {
      const gameId = await this.gameService.createGame({ name, players });

      // assuming the newly created game is returned or fetched after creation, update the store state
      runInAction(() => {
        this.games.push({ id: gameId, name, players }); // simplify as per actual returned data structure
      });
    } catch (error) {
      console.error('Failed to create a new game:', error);
      // handle error, possibly set some state to reflect the error in the UI
    }
  }

  // Set the current game (for example, when a game is clicked or selected)
  setCurrentGame(game: any) {
    // replace 'any' with a type if available
    this.currentGame = game;
  }

  // Any other game-related actions or computed values you need...
}
