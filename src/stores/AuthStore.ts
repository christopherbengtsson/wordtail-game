import { makeAutoObservable, observable, runInAction } from 'mobx';
import { Session, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { AuthService } from '../services';

export class AuthStore {
  private authService: AuthService;

  session: Session | null = null;
  confirmEmail = false;

  constructor(authService: AuthService) {
    makeAutoObservable(this, {
      session: observable,
      confirmEmail: observable,
    });

    this.authService = authService;

    this.init();
  }

  private async init() {
    const { data, error } = await this.authService.getSession();

    console.log('auth store init', data);

    if (error) {
      console.error(error);
    }

    runInAction(() => {
      this.session = data.session;
      this.confirmEmail = !!data?.session;
    });

    this.authService.onAuthStateChange((session) => {
      console.log('onAuthStateChange', session);
      runInAction(() => {
        this.session = session;
        this.confirmEmail = !!session;
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

    if (!res.data.session && res.data.user) {
      // User needs to confirm email
      runInAction(() => {
        this.confirmEmail = true;
      });
    }

    return res;
  }
  async signUp(creds: SignUpWithPasswordCredentials) {
    const res = await this.authService.signUp(creds);
    if (res.error) {
      throw res.error;
    }

    console.log('signup', res.data);

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
