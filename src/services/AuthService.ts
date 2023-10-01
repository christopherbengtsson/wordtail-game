import type { Session } from '@supabase/supabase-js';
import { supabaseClientInstance } from '.';

export class AuthService {
  constructor() {}

  async getSession() {
    return supabaseClientInstance.auth.getSession();
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    supabaseClientInstance.auth.onAuthStateChange((_event, session) =>
      callback(session),
    );
  }

  async signUp({ email, password }: { email: string; password: string }) {
    return supabaseClientInstance.auth.signUp({ email, password });
  }

  async signIn({ email, password }: { email: string; password: string }) {
    return supabaseClientInstance.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return supabaseClientInstance.auth.signOut();
  }
}
