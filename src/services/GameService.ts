import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthStore } from '../stores';
import { supabaseClientInstance } from '.';

export class GameService {
  private client: SupabaseClient;
  private authStore: AuthStore;

  constructor(authStore: AuthStore) {
    this.client = supabaseClientInstance;
    this.authStore = authStore;
  }

  async fetchGames() {
    return this.client.rpc('get_user_games', {
      p_user_id: this.authStore.userId,
    });
  }

  async getGameById(id: string) {
    return this.client.rpc('get_game_by_id', {
      p_game_id: id,
    });
  }

  async createGame({ name, players }: { name: string; players: string[] }) {
    return this.client.rpc('create_new_game', {
      p_creator_id: this.authStore.userId,
      p_game_name: name,
      p_player_ids: players,
    });
  }
}
