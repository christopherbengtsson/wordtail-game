import { BrowserRouter } from 'react-router-dom';
import { Routes } from './Routes';
import { MainStore, MainStoreProvider } from './stores';

const store = new MainStore();
window.store = store;

export function Application() {
  return (
    /**TODO: Add ErrorBoundary */
    <MainStoreProvider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </MainStoreProvider>
  );
}
