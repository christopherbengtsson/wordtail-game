import { makeAutoObservable } from 'mobx';
import { AuthStore, GameStore, NotificationStore } from '.';
import { AuthService, GameService, NotificationService } from '../services';

export class MainStore {
  authStore: AuthStore;
  gameStore: GameStore;
  notificationStore: NotificationStore;

  constructor() {
    const authService = new AuthService();
    this.authStore = new AuthStore(authService);

    const gameService = new GameService(this.authStore);
    this.gameStore = new GameStore(gameService);

    const notificationService = new NotificationService();
    this.notificationStore = new NotificationStore(notificationService);

    makeAutoObservable(this, {
      authStore: false,
      gameStore: false,
      notificationStore: false,
    });
  }
}
