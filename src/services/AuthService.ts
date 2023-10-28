import type {
  Session,
  SignInWithPasswordCredentials,
} from '@supabase/supabase-js';
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

  async signUp(creds: SignInWithPasswordCredentials) {
    return supabaseClientInstance.auth.signUp({
      ...creds,
      options: {
        emailRedirectTo: `https://${window.location.host}`,
        captchaToken: undefined,
      },
    });
  }

  async signIn(creds: SignInWithPasswordCredentials) {
    return supabaseClientInstance.auth.signInWithPassword(creds);
  }

  async signOut() {
    return supabaseClientInstance.auth.signOut();
  }
}
