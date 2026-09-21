import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import clsx from 'clsx';

import { ROLE, WORKSHOP } from '../../utils/types';

import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import { CloseButton } from '../ui/buttons/close-button/close-button';

import styles from './sidebar.module.css';
import { mockMessages } from '../../utils/mocks';

// Динамичсекие пути
const dynamicPaths = ['/shift', '/shift-search', 'documents'];

// Конфигурация меню: путь, текст, роли и цеха, которым доступен пункт
const menuItems = [
  {
    path: '/home',
    label: 'Главная',
    accessRules: [
      {
        roles: [
          ROLE.EXECUTIVE,
          ROLE.HEAD_PRODUCTION,
          ROLE.SENIOR_MANAGER,
          ROLE.HEAD,
          ROLE.LEAD_MASTER,
          ROLE.MASTER,
          ROLE.DETAIL_MASTER,
          ROLE.PRODUCTION_FOREMAN,
          ROLE.PACKER,
        ],
        workshops: [
          WORKSHOP.W_MANAGEMENT,
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/shift',
    label: 'Табель',
    accessRules: [
      {
        roles: [ROLE.HEAD, ROLE.LEAD_MASTER, ROLE.MASTER, ROLE.DETAIL_MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
        ],
      },
      {
        roles: [ROLE.MASTER, ROLE.DETAIL_MASTER],
        workshops: [WORKSHOP.W_LPC11],
      },
    ],
  },
  {
    path: '/production',
    label: 'Производство',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/shipment',
    label: 'Отгрузка',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/pack',
    label: 'Упаковка',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/fix',
    label: 'Раскрепление',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/residue',
    label: 'Остаток',
    accessRules: [
      {
        roles: [ROLE.MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/scan',
    label: 'Сканирование',
    accessRules: [
      {
        roles: [ROLE.PACKER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/documents',
    label: 'Документы',
    accessRules: [
      {
        roles: [ROLE.HEAD, ROLE.LEAD_MASTER, ROLE.MASTER, ROLE.DETAIL_MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
  {
    path: '/shift-search',
    label: 'Найти смену',
    accessRules: [
      {
        roles: [ROLE.HEAD, ROLE.LEAD_MASTER, ROLE.MASTER, ROLE.DETAIL_MASTER],
        workshops: [
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
        ],
      },
      {
        roles: [ROLE.MASTER, ROLE.DETAIL_MASTER],
        workshops: [WORKSHOP.W_LPC11],
      },
    ],
  },
  {
    path: '/employee',
    label: 'Персонал',
    accessRules: [
      {
        roles: [ROLE.LEAD_MASTER, ROLE.PRODUCTION_FOREMAN],
        workshops: [WORKSHOP.W_LPC10],
      },
      {
        roles: [ROLE.HEAD, ROLE.PRODUCTION_FOREMAN],
        workshops: [WORKSHOP.W_LPC8_UGP, WORKSHOP.W_LPC8_UL, WORKSHOP.W_LPC11],
      },
    ],
  },
  {
    path: '/notices',
    label: 'Уведомления',
    accessRules: [
      {
        roles: [
          ROLE.EXECUTIVE,
          ROLE.HEAD_PRODUCTION,
          ROLE.SENIOR_MANAGER,
          ROLE.HEAD,
          ROLE.LEAD_MASTER,
          ROLE.MASTER,
          ROLE.DETAIL_MASTER,
          ROLE.PRODUCTION_FOREMAN,
          ROLE.PACKER,
        ],
        workshops: [
          WORKSHOP.W_MANAGEMENT,
          WORKSHOP.W_LPC4,
          WORKSHOP.W_LPC5,
          WORKSHOP.W_LPC8_UGP,
          WORKSHOP.W_LPC8_UL,
          WORKSHOP.W_PMP_SOUTH,
          WORKSHOP.W_PMP_NORTH,
          WORKSHOP.W_LPC10,
          WORKSHOP.W_LPC11,
        ],
      },
    ],
  },
];

export const Sidebar = () => {
  const {
    isMenuOpen,
    setIsOverlayOpen,
    setIsMenuOpen,
    setIsLogoutOpen,
    setSelectedDate,
  } = useContext(LayerContext);

  const profile = useSelector(selectProfile);
  const location = useLocation(); // Получаем текущий путь

  const unresolvedCount = mockMessages.reduce(
    (acc, m) => acc + (m.isResolved ? 0 : 1),
    0,
  );

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
    if (dynamicPaths.includes(path)) {
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
    if (!profile?.role || !profile?.workshopCode) {
      return false;
    }

    return accessRules.some((rule) => {
      // Проверяем, есть ли текущая роль пользователя в списке разрешённых ролей для этого правила
      const hasRoleAccess = rule.roles.includes(profile.role);

      if (!hasRoleAccess) {
        return false;
      }

      // Иначе проверяем, есть ли текущий цех пользователя в списке разрешённых цехов
      return rule.workshops.includes(profile.workshopCode);
    });
  };

  return (
    <div
      className={clsx(styles.container, isMenuOpen && styles.menu__open)}
      onClick={handleMenuClick}
    >
      <CloseButton />

      <nav className={styles.navigation}>
        <ul className={styles.navigation__list}>
          {menuItems.map(({ path, label, accessRules }) => {
            // Проверяем, есть ли у пользователя доступ к пункту меню
            const hasAccess = hasAccessToMenuItem(accessRules);

            if (!hasAccess) {
              return null;
            }

            // Сюда потом подставишь реальный счётчик из Redux, пока заглушка
            const noticeCount = path === '/notices' ? unresolvedCount : 0;

            return (
              <li
                key={path}
                className={clsx(
                  styles.link,
                  isActive(path) && styles.link__active,
                )}
                onClick={handleMenuItemClick}
              >
                <Link to={path}>
                  <span className={styles.label}>{label}</span>

                  {noticeCount > 0 && (
                    <span className={styles.badge}>{noticeCount}</span>
                  )}
                </Link>
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
