import { makeAutoObservable, reaction } from 'mobx';
import { NotificationService, supabaseClientInstance } from '../services';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { MainStore } from '.';
import { Database } from '../services/IDatabase';

export type NotificationRow =
  Database['public']['Tables']['notifications']['Row'];

export class NotificationStore {
  private mainStore: MainStore;
  private notificationService: NotificationService;

  constructor(mainStore: MainStore, notificationService: NotificationService) {
    makeAutoObservable(this);
    this.mainStore = mainStore;
    this.notificationService = notificationService;

    reaction(
      () => this.mainStore.authStore.session?.user.id,
      (userId) => {
        if (userId) {
          this.subscribe();
        } else {
          supabaseClientInstance.removeAllChannels();
        }
      },
    );
  }

  // Subscribing to inserts on notifications for logged in user
  private async subscribe() {
    supabaseClientInstance
      .channel('any')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${this.mainStore.authStore.userId}`,
        },
        (payload: RealtimePostgresInsertPayload<NotificationRow>) =>
          this.handleNotifications(payload),
      )
      .subscribe();
  }

  private async handleNotifications(
    payload: RealtimePostgresInsertPayload<NotificationRow>,
  ) {
    const queries = [];

    // TODO: query keys as constants
    switch (payload.new.type) {
      case 'game_invite':
        queries.push('games');
        break;

      case 'game_move_turn':
        queries.push('games');
        queries.push('game');
        queries.push('gameStats');
        queries.push('gameBaseStats');
        break;
    }

    this.mainStore.queryClient?.invalidateQueries(queries);
    this.removeNotification(payload.new.id);
  }

  private async removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }
}
