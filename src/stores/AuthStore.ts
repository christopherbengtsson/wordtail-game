import { makeAutoObservable, observable, runInAction } from 'mobx';
import { Session, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { AuthService } from '../services';

export class AuthStore {
  private authService: AuthService;

  session: Session | null = null;
  confirmEmail = false;
  isE2e = false;

  constructor(authService: AuthService) {
    makeAutoObservable(this, {
      session: observable,
      confirmEmail: observable,
      isE2e: observable,
    });

    this.authService = authService;

    this.init();
  }

  private async init() {
    const { error } = await this.authService.getSession();

    if (error) {
      console.error(error);
    }

    this.authService.onAuthStateChange((session) => {
      runInAction(() => {
        this.session = session;

        if (this.confirmEmail) {
          this.confirmEmail = false;
        }

        if (
          session?.user.email === 'e2e1@wordtail.test' ||
          session?.user.email === 'e2e2@wordtail.test'
        ) {
          this.isE2e = true;
        } else {
          this.isE2e = false;
        }
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

    if (!res.data.session && res.data.user) {
      // User needs to confirm email
      runInAction(() => {
        this.confirmEmail = true;
      });
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
