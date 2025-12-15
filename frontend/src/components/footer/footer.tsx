import styles from './footer.module.css';

import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/slices/auth/slice';

export const Footer = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <footer className={styles.container}>
      <a className={styles.copyright} href="#">
        {isAuthenticated ? '© МагМеталлПак' : '© Global Pack Studio'}
      </a>
    </footer>
  );
};
