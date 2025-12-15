import './css/index.css';
import App from './components/app/app';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './services/store';
import { ThemeProvider } from './contexts/theme/themeProvider';
import { LayerProvider } from './contexts/layer/layerProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <LayerProvider>
            <App />
          </LayerProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
