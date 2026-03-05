import './css/index.css';
import App from './app/app';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './services/store';
import { LayerProvider } from './contexts/layer/layerProvider';

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
