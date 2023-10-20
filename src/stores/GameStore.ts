import { makeAutoObservable } from 'mobx';
import { GameService, GameList, GameListItem } from '../services';
import { AuthStore } from '.';
import { multiSort } from '../utils';
import { SAOL_BASE_API_URL } from '../Constants';

export type GameMoveParams =
  | {
      gameId: string;
      gameMove: 'add_letter';
      letter: string;
    }
  | {
      gameId: string;
      gameMove: 'give_up' | 'call_bluff' | 'claim_finished_word';
    }
  | {
      gameId: string;
      gameMove: 'reveal_bluff';
      word: string;
    };

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

  async getActiveGameById(id?: string) {
    if (id) {
      return this.gameService.getActiveGameById(id);
    }
  }

  async createGame(params: {
    gameName: string;
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

  async handleGameMove(params: GameMoveParams) {
    const { gameId, gameMove } = params;

    switch (gameMove) {
      case 'give_up':
        return this.gameService.giveUpMove(gameId);

      case 'add_letter':
        return this.gameService.addLetterMove({
          gameId,
          letter: params.letter,
        });

      case 'claim_finished_word':
        return this.gameService.claimFinishedWordMove({
          gameId,
          apiUrl: `${SAOL_BASE_API_URL}/sok?sok=`,
        });

      case 'call_bluff':
        return this.gameService.callBluffMove(gameId);

      case 'reveal_bluff':
        return this.gameService.revealBluffMove({
          gameId,
          word: params.word,
          saolBaseUrl: `${SAOL_BASE_API_URL}/sok?sok=`,
        });
    }
  }

  /** Stats queries */
  async getBaseGameStatsById(gameId: string) {
    return this.gameService.getBaseGameStatsById(gameId);
  }
  async getGameStatsById(gameId: string) {
    return this.gameService.getGameStatsById(gameId);
  }

  sortActiveGames(games: GameList) {
    return games
      .filter((game) => game.status === 'active')
      .sort((a, b) =>
        multiSort({
          a,
          b,
          condition: (item: GameListItem) =>
            item.currentTurnProfileId === this.authStore.userId,
        }),
      );
  }
  sortPendingGames(games: GameList) {
    return games
      .filter((game) => game.status === 'pending')
      .sort((a, b) =>
        multiSort({
          a,
          b,
          condition: (item: GameListItem) =>
            item.waitingForUsers.includes(this.authStore.userId),
        }),
      );
  }
  sortFinishedGames(games: GameList) {
    return games.filter(
      (game) => game.status === 'abandoned' || game.status === 'finished',
    );
  }
  getNumberOfInvites(pendingGames: GameList) {
    return pendingGames.filter(({ waitingForUsers }) =>
      waitingForUsers?.includes(this.authStore.userId),
    ).length;
  }
  getNumberOfWaitingTurns(activeGames: GameList) {
    return activeGames.filter(
      ({ currentTurnProfileId }) =>
        currentTurnProfileId === this.authStore.userId,
    ).length;
  }
}
