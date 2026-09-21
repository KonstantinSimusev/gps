import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackIcon } from '../../../components/ui/icons/back/back';
import { IconButton } from '../../../components/ui/buttons/icon-button/icon-button';
import { MainLayout } from '../../../components/ui/layouts/main/main-layout';

import styles from './document-item-page.module.css';

export const DocumentItemPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      <IconButton
        type='button'
        onClick={handleBackClick}
        className={styles.button}
      >
        <BackIcon className={styles.back__icon} />
      </IconButton>
      <p>Document Item</p>
    </MainLayout>
  );
};
