import { makeAutoObservable, runInAction } from 'mobx';

import { SupabaseStore } from './SupabaseStore';
import { DatabaseService } from '../api';
import { Credentials } from '../pages';

export class MainStore {
  readonly supabaseStore: SupabaseStore;
  readonly supabaseService: DatabaseService;

  games: object[] | null = null;
  friends: string[] | null = null;
  user: object | null = null;

  constructor() {
    makeAutoObservable(this, {
      supabaseStore: false,
      supabaseService: false,
    });

    this.supabaseStore = new SupabaseStore();
    this.supabaseService = new DatabaseService(this);
  }

  get userId() {
    return this.supabaseStore.session?.user.id;
  }

  async loginOrRegister({
    email,
    password,
    doRegister,
  }: Credentials & { doRegister: boolean }) {
    try {
      if (doRegister) {
        await this.supabaseStore.signUp({ email, password });
      } else {
        await this.supabaseStore.signIn({ email, password });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchGames() {
    try {
      const playerGames = await this.supabaseService.fetchGames();
      console.log(playerGames);

      runInAction(() => {
        this.games = playerGames;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async createGame({ name, players }: { name: string; players: string[] }) {
    try {
      const gameId = await this.supabaseService.createGame({
        name,
        players: [...players],
      });
      console.log(gameId);
    } catch (error) {
      console.error(error);
    }
  }

  get isLoggedIn() {
    return !!this.supabaseStore.session?.user.id;
  }
}
