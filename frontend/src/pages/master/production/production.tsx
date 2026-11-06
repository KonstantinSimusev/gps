import { useEffect } from 'react';
import styles from './production.module.css';

export const Production = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return <div className={styles.wrapper}>Hello, World!</div>;
};
