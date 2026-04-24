import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import { PageTitle } from '../ui/page-title/page-title';
import { IconButton } from '../ui/icon-button/icon-button';
import { AddIcon } from '../ui/icons/add/add';
import { SearchIcon } from '../ui/icons/search/search';

import styles from './cover.module.css';

export const Cover = () => {
  const {
    isAgreed,
    setIsOverlayOpen,
    setIsEmployeeSearchOpen,
    setIsEmployeeCreateOpen,
  } = useContext(LayerContext);

  const { pathname } = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isAdmin = pathname.startsWith('/admin');
  const isHome = pathname === '/home';
  const isMasterTimesheet = pathname === '/master/timesheet';
  const isPackerScan = pathname === '/packer/scan';

  const createEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeCreateOpen(true);
  };

  const searchEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeSearchOpen(true);
  };

  return (
    <>
      {isAuthenticated && isAgreed && (
        <div className={styles.container}>
          {isAdmin && (
            <>
              <PageTitle title='ПОЛЬЗОВАТЕЛИ' />

              <div className={styles.buttons__wrapper}>
                <IconButton type='button' onClick={createEmployee}>
                  <AddIcon />
                </IconButton>

                <IconButton type='button' onClick={searchEmployee}>
                  <SearchIcon width={18} height={18} />
                </IconButton>
              </div>
            </>
          )}

          {isHome && <PageTitle title='ГЛАВНАЯ' />}
          {isMasterTimesheet && <PageTitle title='ТАБЕЛЬ' />}
          {isPackerScan && <PageTitle title='СКАНИРОВАНИЕ' />}
        </div>
      )}
    </>
  );
};
