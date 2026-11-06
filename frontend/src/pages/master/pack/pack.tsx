import { useEffect } from 'react';
import styles from './pack.module.css';

export const Pack = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return <div className={styles.wrapper}>Hello, World!</div>;
};
