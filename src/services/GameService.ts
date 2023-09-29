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

  // Fetch all games for a user
  async fetchGames(): Promise<any[]> {
    // consider replacing 'any' with a game type if available
    const { data, error } = await this.client.rpc('get_user_games', {
      p_user_id: this.authStore.userId,
    });

    if (error) {
      console.error('Failed to fetch games:', error);
      throw new Error(error.message);
    }

    return data;
  }

  // Create a new game
  async createGame({
    name,
    players,
  }: {
    name: string;
    players: string[];
  }): Promise<string> {
    // consider changing return type based on what the RPC returns
    const { data, error } = await this.client.rpc('create_new_game', {
      // Your parameter naming may vary, adjust as necessary
      p_game_name: name,
      p_players: players,
      // Possibly the creator ID if necessary
    });

    if (error) {
      console.error('Failed to create a new game:', error);
      throw new Error(error.message);
    }

    return data;
  }
}
