import { useEffect } from 'react';
import styles from './fix.module.css';

export const Fix = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return <div className={styles.wrapper}>Hello, World!</div>;
};
