import { useEffect } from 'react';

import { MainLayout } from '../../../components/ui/layouts/main/main-layout';

import styles from './fix.module.css';

export const Fix = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <MainLayout>
      <div className={styles.wrapper}>Hello, World!</div>
    </MainLayout>
  );
};
