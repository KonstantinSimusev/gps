import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import clsx from 'clsx';

import { DYNAMIC_PATHS, MENU_ITEMS } from '../../utils/constants';
import { LayerContext } from '../../contexts/layer/layerContext';

import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';
import { selectNotices } from '../../services/slices/notice/slice';

import { CloseButton } from '../ui/buttons/close-button/close-button';

import styles from './sidebar.module.css';

export const Sidebar = () => {
  const {
    isMenuOpen,
    setIsOverlayOpen,
    setIsMenuOpen,
    setIsLogoutOpen,
    setSelectedDate,
  } = useContext(LayerContext);

  const employee = useSelector(selectProfile);
  const location = useLocation(); // Получаем текущий путь
  const notices = useSelector(selectNotices) ?? [];

  const handleMenuItemClick = () => {
    setSelectedDate(null); // Сбрасываем дату при переходе
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
    // Защита от пустых путей
    if (!path) {
      return false;
    }

    // Для динамических страниц — только точное совпадение
    if (DYNAMIC_PATHS.includes(path)) {
      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    }

    // Остальные — по префиксу
    return location.pathname.startsWith(path);
  };

  // Функция проверки доступа пользователя к пункту меню на основе правил (роли и цеха)
  const hasAccessToMenuItem = (
    accessRules: { roles: string[]; workshops: string[] }[],
  ): boolean => {
    // Если у пользователя нет роли или цеха — доступ запрещён
    if (!employee?.profileRoleName || !employee?.profileWorkshopCode) {
      return false;
    }

    return accessRules.some((rule) => {
      // Проверяем, есть ли текущая роль пользователя в списке разрешённых ролей для этого правила
      const hasRoleAccess = rule.roles.includes(employee.profileRoleName);

      if (!hasRoleAccess) {
        return false;
      }

      // Иначе проверяем, есть ли текущий цех пользователя в списке разрешённых цехов
      return rule.workshops.includes(employee.profileWorkshopCode);
    });
  };

  return (
    <div
      className={clsx(styles.container, isMenuOpen && styles.open)}
      onClick={handleMenuClick}
    >
      <CloseButton className={styles.button} />

      <ul className={styles.list}>
        {MENU_ITEMS.map(({ path, label, accessRules }) => {
          // Проверяем, есть ли у пользователя доступ к пункту меню
          const hasAccess = hasAccessToMenuItem(accessRules);

          if (!hasAccess) {
            return null;
          }

          // Сюда потом подставишь реальный счётчик из Redux, пока заглушка
          const noticeCount = path === '/notices' ? notices.length : 0;

          return (
            <li key={path}>
              <Link
                to={path}
                className={clsx(styles.link, isActive(path) && styles.active)}
                onClick={handleMenuItemClick}
              >
                <span className={styles.label}>{label}</span>

                {noticeCount > 0 && (
                  <span className={styles.badge}>{noticeCount}</span>
                )}
              </Link>
            </li>
          );
        })}

        <li>
          <button className={styles.logoutButton} onClick={handleClickLogout}>
            Выйти
          </button>
        </li>
      </ul>
    </div>
  );
};
