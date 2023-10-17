import type { AuthStore } from '../stores';
import { supabaseClientInstance } from '.';
import { Database } from './IDatabase';

export type TGameList =
  Database['public']['Functions']['get_user_games']['Returns'];
export type TGameListItem = TGameList[0];

export type TActiveGame =
  Database['public']['Functions']['get_active_game_by_id']['Returns'][0];

export type TGameStatus = Database['public']['Enums']['game_status'];

export type TMoveType = Database['public']['Enums']['move_type'];
export class GameService {
  private authStore: AuthStore;

  constructor(authStore: AuthStore) {
    this.authStore = authStore;
  }

  async fetchGames() {
    return supabaseClientInstance.rpc('get_user_games', {
      p_user_id: this.authStore.userId,
    });
  }

  async getActiveGameById(id: string) {
    return supabaseClientInstance
      .rpc('get_active_game_by_id', {
        p_game_id: id,
      })
      .single();
  }

  async createGame({
    gameName,
    players,
    maxNumberOfMarks,
  }: {
    gameName: string;
    players: string[];
    maxNumberOfMarks: number;
  }) {
    return supabaseClientInstance.rpc('create_new_game', {
      p_creator_id: this.authStore.userId,
      p_game_name: gameName,
      p_player_ids: players,
      p_max_number_of_marks: maxNumberOfMarks,
    });
  }

  async handleGameInvitation({
    gameId,
    accept,
  }: {
    gameId: string;
    accept: boolean;
  }) {
    if (accept) {
      return supabaseClientInstance.rpc('accept_game_invitation', {
        p_game_id: gameId,
        p_user_id: this.authStore.userId,
      });
    }

    return supabaseClientInstance.rpc('decline_game_invitation', {
      p_game_id: gameId,
      p_user_id: this.authStore.userId,
    });
  }

  async giveUpMove(gameId: string) {
    return supabaseClientInstance.rpc('give_up_move', {
      p_game_id: gameId,
      p_user_id: this.authStore.userId,
    });
  }

  async addLetterMove({ gameId, letter }: { gameId: string; letter: string }) {
    return supabaseClientInstance.rpc('add_letter_move', {
      p_game_id: gameId,
      p_user_id: this.authStore.userId,
      p_letter: letter,
    });
  }

  async claimFinishedWordMove({
    gameId,
    apiUrl,
  }: {
    gameId: string;
    apiUrl: string;
  }) {
    return supabaseClientInstance
      .rpc('claim_finished_word_move', {
        p_game_id: gameId,
        p_user_id: this.authStore.userId,
        p_saol_base_url: apiUrl,
      })
      .single();
  }

  async callBluffMove(gameId: string) {
    return supabaseClientInstance.rpc('call_bluff_move', {
      p_game_id: gameId,
      p_user_id: this.authStore.userId,
    });
  }

  async revealBluffMove({
    gameId,
    word,
    saolBaseUrl,
  }: {
    gameId: string;
    word: string;
    saolBaseUrl: string;
  }) {
    return supabaseClientInstance.rpc('reveal_bluff_move', {
      p_game_id: gameId,
      p_user_id: this.authStore.userId,
      p_word: word,
      p_saol_base_api_url: saolBaseUrl,
    });
  }

  async getBaseGameStatsById(gameId: string) {
    return supabaseClientInstance
      .rpc('get_base_game_stats_by_id', {
        p_game_id: gameId,
        p_user_id: this.authStore.userId,
      })
      .single();
  }
  async getGameStatsById(gameId: string) {
    return supabaseClientInstance
      .rpc('get_game_stats_by_id', {
        p_game_id: gameId,
        p_user_id: this.authStore.userId,
      })
      .single();
  }
}
