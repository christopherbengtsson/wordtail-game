import { makeAutoObservable } from 'mobx';
import { AuthStore, GameStore, ModalStore, NotificationStore } from '.';
import {
  AuthService,
  DatabaseService,
  GameService,
  NotificationService,
} from '../services';
import { QueryClient } from '@tanstack/react-query';

export class MainStore {
  queryClient: QueryClient;
  authStore: AuthStore;
  gameStore: GameStore;
  notificationStore: NotificationStore;
  modalStore: ModalStore;
  dbService: DatabaseService;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;

    const authService = new AuthService();
    this.authStore = new AuthStore(authService);

    const gameService = new GameService(this.authStore);
    this.gameStore = new GameStore(this.authStore, gameService);

    const notificationService = new NotificationService();
    this.notificationStore = new NotificationStore(this, notificationService);

    const databaseService = new DatabaseService(this.authStore);
    this.dbService = databaseService;

    this.modalStore = new ModalStore();

    makeAutoObservable(this, {
      queryClient: false,
      authStore: false,
      gameStore: false,
      notificationStore: false,
      modalStore: false,
      dbService: false,
    });
  }
}
