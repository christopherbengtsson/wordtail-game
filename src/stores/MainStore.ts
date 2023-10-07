import { makeAutoObservable } from 'mobx';
import { AuthStore, GameStore, ModalStore, NotificationStore } from '.';
import { AuthService, GameService, NotificationService } from '../services';

export class MainStore {
  authStore: AuthStore;
  gameStore: GameStore;
  notificationStore: NotificationStore;
  modalStore: ModalStore;

  constructor() {
    const authService = new AuthService();
    this.authStore = new AuthStore(authService);

    const gameService = new GameService(this.authStore);
    this.gameStore = new GameStore(this.authStore, gameService);

    const notificationService = new NotificationService();
    this.notificationStore = new NotificationStore(notificationService);

    this.modalStore = new ModalStore();

    makeAutoObservable(this, {
      authStore: false,
      gameStore: false,
      notificationStore: false,
      modalStore: false,
    });
  }
}
