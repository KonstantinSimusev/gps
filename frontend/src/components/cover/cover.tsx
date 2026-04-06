import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import styles from './cover.module.css';
import { PageTitle } from '../ui/page-title/page-title';

export const Cover = () => {
  const { isAgreed } = useContext(LayerContext);
  const { pathname } = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isAdmin = pathname.startsWith('/admin');
  const isHome = pathname === '/home';
  const isMasterTimesheet = pathname === '/master/timesheet';
  const isPackerScan = pathname === '/packer/scan';

  return (
    <>
      {isAuthenticated && isAgreed && (
        <div className={styles.container}>
          {isAdmin && <PageTitle title='ПОЛЬЗОВАТЕЛИ' />}
          {isHome && <PageTitle title='ГЛАВНАЯ' />}
          {isMasterTimesheet && <PageTitle title='ТАБЕЛЬ' />}
          {isPackerScan && <PageTitle title='СКАНИРОВАНИЕ' />}
        </div>
      )}
    </>
  );
};
