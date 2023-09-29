import {
  Session,
  SupabaseClient,
  User as SupabaseUser,
  createClient,
} from '@supabase/supabase-js';
import { makeAutoObservable, observable, runInAction } from 'mobx';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../Constants';
import { Credentials } from '../pages';

export class SupabaseStore {
  client: SupabaseClient;

  user: SupabaseUser | null = null;
  session: Session | null = null;

  constructor() {
    makeAutoObservable(this, {
      client: observable.ref,
      user: observable.ref,
      session: observable.ref,
    });

    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    this.client.auth.getSession().then(({ data: { session } }) => {
      runInAction(() => {
        this.session = session;
      });
    });

    this.client.auth.onAuthStateChange((_event, session) => {
      runInAction(() => {
        this.session = session;
      });
    });
  }

  async signUp({ email, password }: Credentials) {
    const { error, data } = await this.client.auth.signUp({
      email,
      password,
    });

    console.log('sign UP', data);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (!data.session) {
      await this.signIn({ email, password });
      return;
    }

    const { user, session } = data;
    this.setAuthData({ user, session });
  }

  async signIn({ email, password }: Credentials) {
    const { error, data } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    console.log('sign IN', data);

    if (error) {
      console.error(error);
    }

    const { user, session } = data;
    this.setAuthData({ user, session });
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();

    if (error) {
      console.error(error);
    }

    runInAction(() => {
      this.session = null;
      this.user = null;
    });
  }

  private setAuthData({
    user,
    session,
  }: {
    user?: SupabaseUser | null;
    session?: Session | null;
  }) {
    runInAction(() => {
      if (session) {
        this.session = session;
      }
      if (user) {
        this.user = user;
      }
    });
  }
}
