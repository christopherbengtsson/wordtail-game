import { makeAutoObservable } from 'mobx';

export class ModalStore {
  constructor() {
    makeAutoObservable(this);
  }

  createGameModalVisible = false;
  setCreateGameModalVisible(visible: boolean) {
    this.createGameModalVisible = visible;
  }
}
