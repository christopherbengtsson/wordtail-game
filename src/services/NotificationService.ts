import { supabaseClientInstance } from '.';

export class NotificationService {
  constructor() {}

  async removeNotification(id: string) {
    return supabaseClientInstance.from('notifications').delete().eq('id', id);
  }
}
