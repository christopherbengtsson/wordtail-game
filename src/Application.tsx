import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import { MainStore, MainStoreProvider } from './stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary, ThemeProvider } from './components';

const store = new MainStore();
window.store = store;

const client = new QueryClient();

export function Application() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={client}>
          <ReactQueryDevtools initialIsOpen={false} />
          <MainStoreProvider store={store}>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </MainStoreProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
