import { makeAutoObservable, runInAction } from 'mobx';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { AuthService } from '../services';

export class AuthStore {
  private authService: AuthService;

  user: SupabaseUser | null = null;
  session: Session | null = null;

  constructor(authService: AuthService) {
    makeAutoObservable(this);
    this.authService = authService;

    // Set up any initial state or reactions if necessary
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

  get userId(): string | undefined {
    return this.session?.user.id;
  }

  get isLoggedIn(): boolean {
    return !!this.userId;
  }

  async signUp({ email, password }: { email: string; password: string }) {
    try {
      await this.authService.signUp(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signIn({ email, password }: { email: string; password: string }) {
    try {
      await this.authService.signIn(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signOut() {
    try {
      await this.authService.signOut();
      this.user = null;
      this.session = null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
