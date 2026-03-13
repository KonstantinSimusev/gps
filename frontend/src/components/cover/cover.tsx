import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import styles from './cover.module.css';
import { PageTitle } from '../ui/page-title/page-title';

export const Cover = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';
  const isHome = pathname === '/home';
  const isTimesheet = pathname === '/timesheet';
  const isProduction = pathname === '/production';
  const isShipment = pathname === '/shipment';

  const { isAgreed } = useContext(LayerContext);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      {isAuthenticated && isAgreed && (
        <div className={styles.container}>
          {isAdmin && <PageTitle title='ADMIN' />}
          {isHome && <PageTitle title='ГЛАВНАЯ' />}
          {isTimesheet && <PageTitle title='ТАБЕЛЬ' />}
          {isProduction && <PageTitle title='ПРОИЗВОДСТВО' />}
          {isShipment && <PageTitle title='ОТГРУЗКА' />}
        </div>
      )}
    </>
  );
};
