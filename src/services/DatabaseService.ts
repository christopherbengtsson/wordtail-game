import { supabaseClientInstance } from '.';
import { AuthStore } from '../stores';
import type { Database } from './IDatabase';

export type TProfile = Database['public']['Tables']['profiles']['Row'];

export class DatabaseService {
  private authStore: AuthStore;

  constructor(authStore: AuthStore) {
    this.authStore = authStore;
  }

  async getProfileById(userId: string) {
    return supabaseClientInstance
      .from('profiles')
      .select()
      .eq('id', userId)
      .single();
  }

  async getFriends() {
    return supabaseClientInstance.rpc('get_user_friends', {
      p_user_id: this.authStore.userId,
    });
  }

  async searchUser(searchTerm: string) {
    return supabaseClientInstance
      .from('profiles')
      .select('id, username')
      .textSearch('username', searchTerm);
  }
}
