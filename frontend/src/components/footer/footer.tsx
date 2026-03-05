import { useContext } from 'react';
import { useSelector } from '../../services/store';

import { LayerContext } from '../../contexts/layer/layerContext';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';

import styles from './footer.module.css';

export const Footer = () => {
  const { isAgreed } = useContext(LayerContext);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      {isAuthenticated && isAgreed && (
        <footer className={styles.container}>
          <a className={styles.copyright} href='#'>
            © Global Pack Studio
          </a>
        </footer>
      )}
    </>
  );
};
