import { useContext } from 'react';
import { useSelector } from '../../services/store';

import { LayerContext } from '../../contexts/layer/layerContext';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';

import { Sidebar } from '../sidebar/sidebar';
import { LogoIcon } from '../ui/icons/logo/logo';
import { BurgerButton } from '../buttons/burger/burger';

import styles from './header.module.css';

export const Header = () => {
  const { isAgreed } = useContext(LayerContext);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      {isAuthenticated && isAgreed && (
        <header className={styles.container}>
          <a className={styles.logo} href='/home'>
            <LogoIcon />
          </a>
          <h1 className={styles.title}>Global Pack Studio</h1>
          <BurgerButton />
          <Sidebar />
        </header>
      )}
    </>
  );
};
