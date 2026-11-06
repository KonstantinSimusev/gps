import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './services/store';

import { LayerProvider } from './contexts/layer/layerProvider';

import App from './app/app';

import './styles/normalize.css'; // 1. Сброс браузера
import './styles/variables.css'; // 2. Переменные (--font-family-*)
import './styles/fonts.css'; // 3. @font-face (подключает файлы шрифтов)
import './styles/global.css'; // 4. Стили компонентов
import './styles/index.css'; // 5. Стили страницы

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
