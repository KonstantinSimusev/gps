import { useEffect } from 'react';
import styles from './residue.module.css';

export const Residue = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return <div className={styles.wrapper}>Hello, World!</div>;
};
