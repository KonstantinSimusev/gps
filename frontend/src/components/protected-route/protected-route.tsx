import { memo, useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

import { LayerContext } from '../../contexts/layer/layerContext';

import { MainLayout } from '../ui/layouts/main/main-layout';

import {
  selectIsAuthenticated,
  selectIsChecking,
} from '../../services/slices/auth/slice';

import styles from './protected-route.module.css';

export const ProtectedRoute = memo(() => {
  const location = useLocation();

  const { setIsAgreed } = useContext(LayerContext);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const checking = useSelector(selectIsChecking);

  useEffect(() => {
    setIsAgreed(true);
  }, []);

  // Пока идёт проверка — показываем пустой блок (безопасность)
  if (checking) {
    return <MainLayout>{checking && <div className={styles.container}></div>}</MainLayout>;
  }

  // Если не авторизован и проверка завершена — редирект
  if (!isAuthenticated) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return <Outlet />;
});
