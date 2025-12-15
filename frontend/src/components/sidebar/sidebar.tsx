import styles from './sidebar.module.css';
import clsx from 'clsx';

import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { CloseButton } from '../buttons/close/close';
import { Switch } from '../switch/switch';

import { LayerContext } from '../../contexts/layer/layerContext';
import { ThemeContext } from '../../contexts/theme/themeContext';

import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../services/slices/auth/slice';
import { type TRole } from '../../utils/types';

export const Sidebar = () => {
  const { isLightTheme } = useContext(ThemeContext);
  const {
    isOpenMenu,
    setIsOpenOverlay,
    setIsOpenMenu,
    setIsLoginModalOpen,
    setIsLogoutOpenModal,
  } = useContext(LayerContext);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation(); // Получаем текущий путь

  const master: TRole = 'MASTER';

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
        isLightTheme ? 'theme-light' : 'theme-dark',
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

          {isAuthenticated && user?.role === master && (
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

          {isAuthenticated &&
            user?.role === master &&
            (user?.teamNumber === 1 ||
              user?.teamNumber === 2 ||
              user?.teamNumber === 3 ||
              user?.teamNumber === 4) && (
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

      <Switch />
    </div>
  );
};
