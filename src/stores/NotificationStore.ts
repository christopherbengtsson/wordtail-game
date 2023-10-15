import { makeAutoObservable, reaction } from 'mobx';
import { NotificationService, supabaseClientInstance } from '../services';
import { QueryClient } from '@tanstack/react-query';
import { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { AuthStore } from '.';
import { Database } from '../services/IDatabase';

export type NotificationRow =
  Database['public']['Tables']['notifications']['Row'];
export class Notification {
  id: string;
  message: string;
  seen: boolean;
  createdAt: Date;

  constructor(id: string, message: string, seen: boolean, createdAt: Date) {
    this.id = id;
    this.message = message;
    this.seen = seen;
    this.createdAt = createdAt;
  }
}

export class NotificationStore {
  private queryClient: QueryClient;
  private authStore: AuthStore;

  notifications: Notification[] = [];
  service: NotificationService;

  constructor(service: NotificationService, authStore: AuthStore) {
    makeAutoObservable(this);
    this.service = service;
    this.authStore = authStore;

    this.queryClient = new QueryClient();

    reaction(
      () => this.authStore.session?.user.id,
      (userId) => {
        if (userId) {
          this.subscribe();
        } else {
          supabaseClientInstance.removeAllChannels();
        }
      },
    );
  }
  async subscribe() {
    supabaseClientInstance
      .channel('any')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${this.authStore.session?.user.id}`,
        },
        this.handleNotifications,
      )
      .subscribe();
  }

  async handleNotifications(
    payload: RealtimePostgresInsertPayload<NotificationRow>,
  ) {
    const queries = [];
    switch (payload.new.type) {
      case 'game_invite':
        queries.push('games');
        break;
    }
    this.queryClient.invalidateQueries(queries);
  }
}
