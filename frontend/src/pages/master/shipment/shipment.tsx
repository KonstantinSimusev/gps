import { useEffect } from 'react';

import { MainLayout } from '../../../components/ui/layouts/main/main-layout';

// import styles from './shipment.module.css';

export const Shipment = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <MainLayout>
      Hello
    </MainLayout>
  );
};
