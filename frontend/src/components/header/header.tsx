import { useContext } from 'react';

import { ROLE } from '../../utils/types';

import { useSelector } from '../../services/store';

import {
  selectIsAuthenticated,
  selectProfile,
} from '../../services/slices/auth/slice';

import { LayerContext } from '../../contexts/layer/layerContext';

import { IconButton } from '../ui/buttons/icon-button/icon-button';
import { Sidebar } from '../sidebar/sidebar';

import { AddIcon } from '../ui/icons/add/add';
import { BurgerIcon } from '../ui/icons/burger/burger';
import { LogoIcon } from '../ui/icons/logo/logo';
import { SearchIcon } from '../ui/icons/search/search';

import styles from './header.module.css';

export const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);

  const {
    isAgreed,
    setIsOverlayOpen,
    setIsMenuOpen,
    setIsEmployeeCreateOpen,
    setIsEmployeeSearchOpen,
  } = useContext(LayerContext);

  const handleClick = () => {
    setIsMenuOpen(true);
    setIsOverlayOpen(true);
  };

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
        <header className={styles.container}>
          <a className={styles.logo} href='/home'>
            <LogoIcon />
          </a>
          <h1 className={styles.title}>Steel Pack Studio</h1>

          <div className={styles.buttons}>
            {profile && profile.role === ROLE.ADMIN && (
              <>
                <IconButton type='button' onClick={searchEmployee}>
                  <SearchIcon width={24} height={24} />
                </IconButton>

                <IconButton type='button' onClick={createEmployee}>
                  <AddIcon
                    width={26}
                    height={26}
                    className={styles.icon__white}
                  />
                </IconButton>
              </>
            )}

            <IconButton type='button' onClick={handleClick}>
              <BurgerIcon />
            </IconButton>
          </div>

          <Sidebar />
        </header>
      )}
    </>
  );
};
