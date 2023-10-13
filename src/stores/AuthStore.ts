import { makeAutoObservable, runInAction } from 'mobx';
import { Session, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { AuthService } from '../services';

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

  async signIn(creds: SignUpWithPasswordCredentials) {
    const res = await this.authService.signIn(creds);
    if (res.error) {
      throw res.error;
    }

    return res;
  }
  async signUp(creds: SignUpWithPasswordCredentials) {
    const res = await this.authService.signUp(creds);
    if (res.error) {
      throw res.error;
    }

    return res;
  }
  async signOut() {
    this.authService.signOut();
  }

  async DEV_GENERATE_USERS() {
    await Promise.all([
      this.authService.signUp({
        email: 'user1@example.com',
        password: '123456789',
      }),
      this.authService.signUp({
        email: 'user2@example.com',
        password: '123456789',
      }),
      this.authService.signUp({
        email: 'user3@example.com',
        password: '123456789',
      }),
    ]);
  }
}
