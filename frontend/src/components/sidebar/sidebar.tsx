import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import clsx from 'clsx';

import { ROLE } from '../../utils/types';

import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import { CloseButton } from '../ui/buttons/close-button/close-button';

import styles from './sidebar.module.css';

// Конфигурация меню: путь, текст и роли, которым доступен пункт
const menuItems = [
  {
    path: '/home',
    label: 'Главная',
    roles: [
      ROLE.ADMIN,
      ROLE.HEAD,
      ROLE.LEAD_MASTER,
      ROLE.MASTER,
      ROLE.DETAIL_MASTER,
    ],
  },
  {
    path: '/admin',
    label: 'Пользователи',
    roles: [ROLE.ADMIN],
  },
  {
    path: '/timesheet',
    label: 'Табель',
    roles: [ROLE.LEAD_MASTER, ROLE.MASTER, ROLE.DETAIL_MASTER],
  },
  {
    path: '/production',
    label: 'Производство',
    roles: [ROLE.MASTER],
  },
  {
    path: '/shipment',
    label: 'Отгрузка',
    roles: [ROLE.MASTER],
  },
  {
    path: '/pack',
    label: 'Упаковка',
    roles: [ROLE.MASTER],
  },
  {
    path: '/fix',
    label: 'Раскрепление',
    roles: [ROLE.MASTER],
  },
  {
    path: '/residue',
    label: 'Остаток',
    roles: [ROLE.MASTER],
  },
  {
    path: '/scan',
    label: 'Сканирование',
    roles: [ROLE.PACKER],
  },
];

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

  // Функция проверки активности пункта меню
  const isActive = (path: string): boolean => {
    if (path === '/timesheet') {
      return (
        location.pathname === '/timesheet' ||
        location.pathname.startsWith('/timesheet/')
      );
    }
    return location.pathname === path;
  };

  return (
    <div
      className={clsx(styles.container, isMenuOpen && styles.menu__open)}
      onClick={handleMenuClick}
    >
      <CloseButton />

      <nav className={styles.navigation}>
        <ul className={styles.navigation__list}>
          {menuItems.map(({ path, label, roles }) => {
            // Проверяем, есть ли у пользователя доступ к пункту меню
            const hasAccess = roles.some((role) => profile?.role === role);
            if (!hasAccess) return null;

            return (
              <li
                key={path}
                className={clsx(
                  styles.link,
                  isActive(path) && styles.link__active,
                )}
                onClick={handleClick}
              >
                <Link to={path}>{label}</Link>
              </li>
            );
          })}

          <li className={clsx(styles.link)} onClick={handleClickLogout}>
            Выйти
          </li>
        </ul>
      </nav>
    </div>
  );
};
