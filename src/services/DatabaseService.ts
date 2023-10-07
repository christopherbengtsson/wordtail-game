import { supabaseClientInstance } from '.';
import type { Database } from './IDatabase';

export type TProfile = Database['public']['Tables']['profiles']['Row'];

export async function getFriends(userId: string) {
  return supabaseClientInstance.rpc('get_user_friends', {
    user_id: userId,
  });
}

export async function searchUser(searchTerm: string) {
  return supabaseClientInstance
    .from('profiles')
    .select('id, username')
    .textSearch('username', searchTerm);
}
