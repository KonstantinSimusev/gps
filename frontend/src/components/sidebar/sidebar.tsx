import clsx from 'clsx';

import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { CloseButton } from '../buttons/close/close';

import { LayerContext } from '../../contexts/layer/layerContext';
import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';

import {
  ADMIN_ROLE,
  HEAD_ROLE,
  MASTER_ROLE,
  PACKER_ROLE,
  USER_ROLE,
} from '../../utils/types';

import styles from './sidebar.module.css';

export const Sidebar = () => {
  const { isMenuOpen, setIsOverlayOpen, setIsMenuOpen, setIsLogoutOpen } =
    useContext(LayerContext);

  const profile = useSelector(selectProfile);
  const location = useLocation(); // Получаем текущий путь

  const handleClick = () => {
    setIsOverlayOpen(false);
    setIsMenuOpen(false);
  };

  const handleClickLogout = () => {
    setIsMenuOpen(false);
    setIsLogoutOpen(true);
  };

  // Функция для предотвращения закрытия при клике на элементы меню
  const handleMenuClick = (event: React.MouseEvent) => {
    // Останавливаем распространение события
    event.stopPropagation();
  };

  return (
    <div
      className={clsx(styles.container, isMenuOpen && styles.menu__open)}
      onClick={handleMenuClick}
    >
      <CloseButton />

      <nav className={styles.navigation}>
        <ul className={styles.navigation__list}>
          {(profile?.role === ADMIN_ROLE ||
            profile?.role === USER_ROLE ||
            profile?.role === HEAD_ROLE ||
            profile?.role === MASTER_ROLE) && (
            <li
              className={clsx(
                styles.link,
                location.pathname === '/home' && styles.link__active,
              )}
              onClick={handleClick}
            >
              <Link to='/home'>Главная</Link>
            </li>
          )}

          {profile?.role === ADMIN_ROLE && (
            <li
              className={clsx(
                styles.link,
                location.pathname === '/admin' && styles.link__active,
              )}
              onClick={handleClick}
            >
              <Link to='/admin'>Пользователи</Link>
            </li>
          )}

          {profile?.role === MASTER_ROLE && (
            <li
              className={clsx(
                styles.link,
                location.pathname === '/master/timesheet' &&
                  styles.link__active,
              )}
              onClick={handleClick}
            >
              <Link to='/master/timesheet'>Табель</Link>
            </li>
          )}

          {profile?.role === PACKER_ROLE && (
            <li
              className={clsx(
                styles.link,
                location.pathname === '/packer/scan' && styles.link__active,
              )}
              onClick={handleClick}
            >
              <Link to='/packer/scan'>Сканирование</Link>
            </li>
          )}

          <li className={clsx(styles.link)} onClick={handleClickLogout}>
            Выйти
          </li>
        </ul>
      </nav>
    </div>
  );
};
