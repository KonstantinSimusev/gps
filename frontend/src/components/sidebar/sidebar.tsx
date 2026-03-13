import styles from './sidebar.module.css';
import clsx from 'clsx';

import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { CloseButton } from '../buttons/close/close';

import { LayerContext } from '../../contexts/layer/layerContext';

import { useSelector } from '../../services/store';

import { selectEmployee } from '../../services/slices/auth/slice';
import { ADMIN_ROLE, SECTION_MASTER_ROLE } from '../../utils/types';

export const Sidebar = () => {
  const { isOpenMenu, setIsOpenOverlay, setIsOpenMenu, setIsLogoutOpenModal } =
    useContext(LayerContext);

  const employee = useSelector(selectEmployee);
  const location = useLocation(); // Получаем текущий путь

  const handleClick = () => {
    setIsOpenOverlay(false);
    setIsOpenMenu(false);
  };

  const handleClickLogout = () => {
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
      className={clsx(styles.container, isOpenMenu && styles.menu__open)}
      onClick={handleMenuClick}
    >
      <CloseButton />

      <nav className={styles.navigation}>
        <ul className={styles.navigation__list}>
          {employee?.role === ADMIN_ROLE ||
            (employee?.role === SECTION_MASTER_ROLE && (
              <li
                className={clsx(
                  styles.link,
                  location.pathname === '/home' && styles.link__active,
                )}
                onClick={handleClick}
              >
                <Link to='/home'>Главная</Link>
              </li>
            ))}

          {employee?.role === SECTION_MASTER_ROLE && (
            <li
              className={clsx(
                styles.link,
                location.pathname === '/timesheet' && styles.link__active,
              )}
              onClick={handleClick}
            >
              <Link to='/timesheet'>Табель</Link>
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
