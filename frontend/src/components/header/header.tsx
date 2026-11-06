import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { LayerContext } from '../../contexts/layer/layerContext';

import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';
// import { selectNotices } from '../../services/slices/notice/slice';

import { IconButton } from '../ui/buttons/icon-button/icon-button';
import { Sidebar } from '../sidebar/sidebar';

import { AddIcon } from '../ui/icons/add/add';
// import { BellIcon } from '../ui/icons/bell/bell';
import { BurgerIcon } from '../ui/icons/burger/burger';
import { LogoIcon } from '../ui/icons/logo/logo';
import { SearchIcon } from '../ui/icons/search/search';

import styles from './header.module.css';

export const Header = () => {
  const {
    isAgreed,
    setIsOverlayOpen,
    setIsMenuOpen,
    setIsEmployeeCreateOpen,
    setIsEmployeeSearchOpen,
    setIsShiftSearchOpen,
  } = useContext(LayerContext);

  const location = useLocation();
  // const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  // const notices = useSelector(selectNotices) ?? [];
  // const isUnread = notices.some((n) => n.isUnread);

  const handleBurgerClick = () => {
    setIsMenuOpen(true);
    setIsOverlayOpen(true);
  };

  // const handleBellClick = () => {
  //   navigate('/notices');
  // };

  const openCreateModal = () => {
    setIsOverlayOpen(true);

    if (location.pathname === '/employee') {
      setIsEmployeeCreateOpen(true);
    }
  };

  const openSearchModal = () => {
    setIsOverlayOpen(true);

    if (location.pathname === '/employee') {
      setIsEmployeeSearchOpen(true);
    }

    if (location.pathname === '/shift-search') {
      setIsShiftSearchOpen(true);
    }
  };

  // Определяем, нужно ли показывать кнопки
  const isEmployeePage = location.pathname === '/employee';
  const isSearchShiftPage = location.pathname === '/shift-search';

  const isSearchButtonVisible = isEmployeePage || isSearchShiftPage;
  const isCreateButtonVisible = isEmployeePage;

  return (
    <>
      {isAuthenticated && isAgreed && (
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <a className={styles.logo} href='/home'>
              <LogoIcon />
            </a>
            <h1 className={styles.title}>Pack Studio</h1>
          </div>

          <div className={styles.actions}>
            {isSearchButtonVisible && (
              <IconButton type='button' onClick={openSearchModal}>
                <SearchIcon width={24} height={24} />
              </IconButton>
            )}

            {isCreateButtonVisible && (
              <IconButton type='button' onClick={openCreateModal}>
                <AddIcon width={26} height={26} />
              </IconButton>
            )}

            {/* <IconButton type='button' onClick={handleBellClick}>
              <BellIcon isUnread={isUnread} badgeColor='red' />
            </IconButton> */}

            <IconButton type='button' onClick={handleBurgerClick}>
              <BurgerIcon />
            </IconButton>
          </div>

          <Sidebar />
        </header>
      )}
    </>
  );
};
