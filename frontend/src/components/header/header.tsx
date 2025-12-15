import styles from './header.module.css';

import { useContext } from 'react';

import { Sidebar } from '../sidebar/sidebar';
import { LogoIcon } from '../icons/logo/logo';
import { BurgerButton } from '../buttons/burger/burger';

import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';
import { LayerContext } from '../../contexts/layer/layerContext';

export const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { isCookie } = useContext(LayerContext);

  return (
    <header className={styles.container}>
      <a className={styles.logo} href="/home">
        <LogoIcon />
      </a>
      <h1 className={styles.title}>
        {isAuthenticated ? 'МагМеталлПак' : 'Global Pack Studio'}
      </h1>
      {isCookie && <BurgerButton />}
      <Sidebar />
    </header>
  );
};
