import type {
  SupabaseClient,
  User as SupabaseUser,
  Session,
} from '@supabase/supabase-js';
import { supabaseClientInstance } from '.';

export class AuthService {
  private client: SupabaseClient;

  constructor() {
    this.client = supabaseClientInstance;
  }

  // Fetch the current session
  async getSession() {
    return this.client.auth.getSession();
  }

  // Listen to changes in authentication state
  onAuthStateChange(callback: (session: Session | null) => void): void {
    this.client.auth.onAuthStateChange((_event, session) => callback(session));
  }

  // Sign up with email and password
  async signUp(email: string, password: string): Promise<SupabaseUser | null> {
    const { data, error } = await this.client.auth.signUp({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    return data?.user;
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<SupabaseUser | null> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.user;
  }

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }
}
