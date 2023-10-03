import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from './Application';

const root = document.getElementById('root') as HTMLElement;
root.dataset.version = pkgJson.version;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
);
