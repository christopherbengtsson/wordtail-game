import { makeAutoObservable } from 'mobx';
import { GameService, TGameList, TGameListItem } from '../services';
import { AuthStore } from '.';
import { multiSort } from '../utils';

import { SAOL_BASE_URL } from '../Constants';

export type GameMoveParams =
  | {
      gameId: string;
      gameMove: 'add_letter' | 'give_up';
      letter?: string;
    }
  | {
      gameId: string;
      gameMove: 'call_bluff';
    }
  | {
      gameId: string;
      gameMove: 'call_finished_word';
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

  async handleGameMove(params: GameMoveParams) {
    const { gameId, gameMove } = params;

    switch (gameMove) {
      case 'add_letter':
      case 'give_up':
        return this.gameService.addLetterOrGiveUp({
          gameId,
          letter: params.letter,
        });

      case 'call_finished_word':
        if (!SAOL_BASE_URL) {
          throw new Error('No SAOL base URL provided');
        }

        return this.gameService.validateCompletedWord({
          gameId,
          apiUrl: `${SAOL_BASE_URL}/sok?sok=`,
        });

      case 'call_bluff':
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
