import { useEffect } from 'react';

import { MainLayout } from '../../../components/ui/layouts/main/main-layout';

import styles from './production.module.css';

export const Production = () => {
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
