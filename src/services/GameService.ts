import type { AuthStore } from '../stores';
import { supabaseClientInstance } from '.';
import { Database } from './IDatabase';

export type TGameList =
  Database['public']['Functions']['get_user_games']['Returns'];
export type TGameListItem = TGameList[0];

export type TActiveGame =
  Database['public']['Functions']['get_game_by_id']['Returns'][0];

export type TGameStatus = Database['public']['Enums']['game_status'];
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

  async getGameById(id: string) {
    return supabaseClientInstance
      .rpc('get_game_by_id', {
        p_game_id: id,
      })
      .single();
  }

  async createGame({
    name,
    players,
    maxNumberOfMarks,
  }: {
    name: string;
    players: string[];
    maxNumberOfMarks: number;
  }) {
    return supabaseClientInstance.rpc('create_new_game', {
      p_creator_id: this.authStore.userId,
      p_game_name: name,
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
}
