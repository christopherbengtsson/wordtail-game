import { SupabaseClient } from '@supabase/supabase-js';
import type { MainStore } from '../stores';

export class DatabaseService {
  readonly store: MainStore;
  readonly client: SupabaseClient;

  constructor(store: MainStore) {
    this.store = store;
    this.client = store.supabaseStore.client;
  }

  async fetchRpc() {
    const { data, error } = await this.client.rpc('initial_fetch', {
      p_user_id: this.store.supabaseStore.session?.user.id,
    });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }

  async fetchGames() {
    const { data, error } = await this.client.rpc('get_user_games', {
      p_user_id: this.store.userId,
    });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }

  async createGame({ name, players }: { name: string; players: string[] }) {
    const { data, error } = await this.client.rpc('create_new_game', {
      p_creator_id: this.store.userId,
      p_game_name: name,
      p_player_ids: players,
    });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }

  async searchUser(searchString: string) {
    const { data, error } = await this.client
      .from('users')
      .select()
      .like('username', `%${searchString}%`);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }
}
