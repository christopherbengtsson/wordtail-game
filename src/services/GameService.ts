import type {
  PostgrestSingleResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import type { AuthStore } from '../stores';
import { supabaseClientInstance } from '.';
import { Database } from './IDatabase';

export type GameList =
  Database['public']['Functions']['get_user_games']['Returns'];
export type GameListItem = GameList[0];

export type ActiveGame =
  Database['public']['Functions']['get_game_by_id']['Returns'][0];
export class GameService {
  private client: SupabaseClient;
  private authStore: AuthStore;

  constructor(authStore: AuthStore) {
    this.client = supabaseClientInstance;
    this.authStore = authStore;
  }

  async fetchGames(): Promise<PostgrestSingleResponse<GameList>> {
    return this.client.rpc('get_user_games', {
      p_user_id: this.authStore.userId,
    });
  }

  async getGameById(id: string): Promise<PostgrestSingleResponse<ActiveGame>> {
    return this.client
      .rpc('get_game_by_id', {
        p_game_id: id,
      })
      .single();
  }

  async createGame({
    name,
    players,
  }: {
    name: string;
    players: string[];
  }): Promise<PostgrestSingleResponse<string>> {
    return this.client.rpc('create_new_game', {
      p_creator_id: this.authStore.userId,
      p_game_name: name,
      p_player_ids: players,
    });
  }

  async handleGameInvitation({
    gameId,
    accept,
  }: {
    gameId: string;
    accept: boolean;
  }): Promise<
    PostgrestSingleResponse<
      Database['public']['Functions'][
        | 'accept_game_invitation'
        | 'decline_game_invitation']['Returns']
    >
  > {
    if (accept) {
      return this.client.rpc('accept_game_invitation', {
        p_game_id: gameId,
        p_user_id: this.authStore.userId,
      });
    }

    return this.client.rpc('decline_game_invitation', {
      p_game_id: gameId,
      p_user_id: this.authStore.userId,
    });
  }
}
