import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './services/store';

import { LayerProvider } from './contexts/layer/layerProvider';

import App from './app/app';

import './css/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LayerProvider>
          <App />
        </LayerProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
