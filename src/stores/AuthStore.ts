import { makeAutoObservable, runInAction } from 'mobx';
import { Session } from '@supabase/supabase-js';
import { AuthService } from '../services';
import { Credentials } from '../pages';

export class AuthStore {
  private authService: AuthService;

  session: Session | null = null;

  constructor(authService: AuthService) {
    makeAutoObservable(this);
    this.authService = authService;

    this.init();
  }

  private async init() {
    const { data, error } = await this.authService.getSession();

    if (error) {
      console.error(error);
    }

    if (data?.session) {
      runInAction(() => {
        this.session = data.session;
      });
    }

    this.authService.onAuthStateChange((session) => {
      runInAction(() => {
        this.session = session;
      });
    });
  }

  get user() {
    if (!this.session?.user.id) {
      throw new Error('No session, calling user');
    }
    return this.session?.user;
  }
  get userId(): string {
    if (!this.session?.user.id) {
      throw new Error('No session, calling userId');
    }
    return this.session.user.id;
  }
  get isLoggedIn(): boolean {
    return !!this.session?.user.id;
  }

  async signIn(creds: Credentials) {
    return await this.authService.signIn(creds);
  }
  async signUp(creds: Credentials) {
    return await this.authService.signUp(creds);
  }
  async signOut() {
    this.authService.signOut();
  }
}
