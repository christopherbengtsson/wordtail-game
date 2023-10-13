import { Routes } from './Routes';
import { MainStore, MainStoreProvider } from './stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  ErrorBoundary,
  ThemeProvider,
  TranslationProvider,
} from './components';
import { isDev } from './Constants';

const store = new MainStore();

if (isDev) {
  window.store = store;
}

const client = new QueryClient();

export function Application() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <ErrorBoundary>
          <QueryClientProvider client={client}>
            <ReactQueryDevtools initialIsOpen={false} />
            <MainStoreProvider store={store}>
              <Routes />
            </MainStoreProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </TranslationProvider>
    </ThemeProvider>
  );
}
