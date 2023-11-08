export const isDev = import.meta.env?.MODE === 'development';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SAOL_WEBSITE_URL = import.meta.env.VITE_SAOL_WEBSITE_BASE_URL;
export const SAOL_BASE_API_URL = import.meta.env.VITE_SAOL_BASE_API_URL;

export const DICE_BEAR_URL = import.meta.env.VITE_DICE_BEAR_URL;

export const E2E_GAME_NAME = 'E2E TEST GAME';
