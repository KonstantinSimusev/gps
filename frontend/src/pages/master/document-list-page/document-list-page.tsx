import { useEffect } from 'react';

import { MainLayout } from '../../../components/ui/layouts/main/main-layout';

// import styles from './document-list-page.module.css';

export const DocumentListPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  return <MainLayout>Document List</MainLayout>;
};
