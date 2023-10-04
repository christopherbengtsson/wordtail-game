import { makeAutoObservable, runInAction } from 'mobx';
import {
  AuthResponse,
  Session,
  User as SupabaseUser,
} from '@supabase/supabase-js';
import { AuthService } from '../services';
import { Credentials } from '../pages';

export class AuthStore {
  private authService: AuthService;

  user: SupabaseUser | null = null;
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
        this.user = session?.user ?? null;
      });
    });
  }

  get userId(): string | undefined {
    return this.session?.user.id;
  }

  get isLoggedIn(): boolean {
    return !!this.userId;
  }

  async signIn(creds: Credentials) {
    return await this.authService.signIn(creds);
  }
  async signUp(creds: Credentials) {
    const res = await this.authService.signUp(creds);
    // TODO: Fix avatar?

    return res;
  }
  async signOut() {
    this.authService.signOut();
  }
}
