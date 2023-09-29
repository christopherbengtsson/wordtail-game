export const isDev = import.meta.env?.MODE === 'development';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SAOL_BASE_URL = import.meta.env.VITE_SAOL_BASE_URL;

export const SERVICE_URL = getServiceUrl();

function getServiceUrl(): string {
  /* c8 ignore next 4 */
  if (isDev) {
    const envUrl = import.meta.env.VITE_SERVICE_URL as string;
    return envUrl ?? 'http://localhost:8080/api/v1/checkout';
  }
  return window.location.origin + '/mdd/api/v1/checkout';
}
