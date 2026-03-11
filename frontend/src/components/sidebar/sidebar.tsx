import styles from './sidebar.module.css';
import clsx from 'clsx';

import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { CloseButton } from '../buttons/close/close';

import { LayerContext } from '../../contexts/layer/layerContext';

import { useSelector } from '../../services/store';

import {
  selectIsAuthenticated,
  selectEmployee,
} from '../../services/slices/auth/slice';
import { SECTION_MASTER_ROLE } from '../../utils/types';

export const Sidebar = () => {
  const {
    isOpenMenu,
    setIsOpenOverlay,
    setIsOpenMenu,
    setIsLoginModalOpen,
    setIsLogoutOpenModal,
  } = useContext(LayerContext);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const employee = useSelector(selectEmployee);
  const location = useLocation(); // Получаем текущий путь

  const hanldeClick = () => {
    setIsOpenOverlay(false);
    setIsOpenMenu(false);
  };

  const hanldeClickLogin = () => {
    setIsOpenMenu(false);
    setIsLoginModalOpen(true);
  };

  const hanldeClickLogout = () => {
    setIsOpenMenu(false);
    setIsLogoutOpenModal(true);
  };

  // Функция для предотвращения закрытия при клике на элементы меню
  const handleMenuClick = (event: React.MouseEvent) => {
    // Останавливаем распространение события
    event.stopPropagation();
  };

  return (
    <div
      className={clsx(
        styles.container,
        isOpenMenu && styles.menu__open,
      )}
      onClick={handleMenuClick}
    >
      <CloseButton />

      <nav className={styles.navigation}>
        <ul className={styles.navigation__list}>
          {isAuthenticated && (
            <li
              className={clsx(
                styles.link,
                location.pathname === '/home' && styles.link__active,
              )}
              onClick={hanldeClick}
            >
              <Link to="/home">Главная</Link>
            </li>
          )}

          {isAuthenticated && employee?.role === SECTION_MASTER_ROLE && (
            <li
              className={clsx(
                styles.link,
                location.pathname === '/timesheet' && styles.link__active,
              )}
              onClick={hanldeClick}
            >
              <Link to="/timesheet">Табель</Link>
            </li>
          )}
{/*  
          {isAuthenticated &&
            employee?.position.role.name === master &&
            (employee?.team.teamNumber === '1' ||
              employee?.team.teamNumber === '2' ||
              employee?.team.teamNumber === '3' ||
              employee?.team.teamNumber === '4') && (
              <>
                <li
                  className={clsx(
                    styles.link,
                    location.pathname === '/production' && styles.link__active,
                  )}
                  onClick={hanldeClick}
                >
                  <Link to="/production">Производство</Link>
                </li>

                <li
                  className={clsx(
                    styles.link,
                    location.pathname === '/shipment' && styles.link__active,
                  )}
                  onClick={hanldeClick}
                >
                  <Link to="/shipment">Отгрузка</Link>
                </li>

                <li
                  className={clsx(
                    styles.link,
                    location.pathname === '/pack' && styles.link__active,
                  )}
                  onClick={hanldeClick}
                >
                  <Link to="/pack">Упаковка</Link>
                </li>

                <li
                  className={clsx(
                    styles.link,
                    location.pathname === '/fix' && styles.link__active,
                  )}
                  onClick={hanldeClick}
                >
                  <Link to="/fix">Раскрепление</Link>
                </li>
              </>
            )}
*/}
          {isAuthenticated && (
            <li className={clsx(styles.link)} onClick={hanldeClickLogout}>
              Выйти
            </li>
          )}

          {!isAuthenticated && (
            <li
              className={clsx(styles.link, styles.link__active, styles.top)}
              onClick={hanldeClickLogin}
            >
              Войти
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};
