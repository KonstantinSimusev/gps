// import styles from './protected-route.module.css';

import { memo, useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsChecking,
} from '../../services/slices/auth/slice';
import { LayerContext } from '../../contexts/layer/layerContext';
import { Loader } from '../ui/loader/loader';
import { MainLayout } from '../ui/layouts/main/main-layout';

export const ProtectedRoute = memo(() => {
  const { setIsCookie } = useContext(LayerContext);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const checking = useSelector(selectIsChecking);
  const location = useLocation();

  useEffect(() => {
    setIsCookie(true);
  }, []);

  // Пока идёт проверка — показываем спиннер
  if (checking) {
    return <MainLayout>{checking && <Loader text="Авторизация" />}</MainLayout>;
  }

  // Если не авторизован и проверка завершена — редирект
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
});
