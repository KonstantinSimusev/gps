import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { mockMessages } from '../../utils/mocks';

import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import { IconButton } from '../ui/buttons/icon-button/icon-button';
import { Sidebar } from '../sidebar/sidebar';

import { AddIcon } from '../ui/icons/add/add';
import { BellIcon } from '../ui/icons/bell/bell';
import { BurgerIcon } from '../ui/icons/burger/burger';
import { LogoIcon } from '../ui/icons/logo/logo';
import { SearchIcon } from '../ui/icons/search/search';

import styles from './header.module.css';

export const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  const isUnread: boolean = mockMessages.some((msg) => msg.isUnread);

  const {
    isAgreed,
    setIsOverlayOpen,
    setIsMenuOpen,
    setIsEmployeeCreateOpen,
    setIsEmployeeSearchOpen,
    setIsShiftSearchOpen,
  } = useContext(LayerContext);

  const handleBurgerClick = () => {
    setIsMenuOpen(true);
    setIsOverlayOpen(true);
  };

  const handleBellClick = () => {
    navigate('/notices');
  };

  const openСreateModal = () => {
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
        <header className={styles.container}>
          <a className={styles.logo} href='/home'>
            <LogoIcon />
          </a>
          <h1 className={styles.title}>Steel Pack Studio</h1>

          <div className={styles.buttons}>
            {isSearchButtonVisible && (
              <IconButton type='button' onClick={openSearchModal}>
                <SearchIcon width={24} height={24} />
              </IconButton>
            )}

            {isCreateButtonVisible && (
              <IconButton type='button' onClick={openСreateModal}>
                <AddIcon
                  width={26}
                  height={26}
                  className={styles.icon__white}
                />
              </IconButton>
            )}

            <IconButton type='button' onClick={handleBellClick}>
              <BellIcon isUnread={isUnread} badgeColor='red' />
            </IconButton>

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
