import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import { MainStore, MainStoreProvider } from './stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const store = new MainStore();
window.store = store;

const client = new QueryClient();

export function Application() {
  return (
    /**TODO: Add ErrorBoundary */
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={true} />
      <MainStoreProvider store={store}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </MainStoreProvider>
    </QueryClientProvider>
  );
}
