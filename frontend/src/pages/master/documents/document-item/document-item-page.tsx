import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackIcon } from '../../../../components/ui/icons/back/back';
import { IconButton } from '../../../../components/ui/buttons/icon-button/icon-button';

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

  // Хелпер для определения пути перехода
  // const getRedirectPath = (notice: INotice): string | undefined => {
  //   switch (notice.categoryCode) {
  //     case 'shift':
  //       // Если есть sourceId — смена существует, идём по ID
  //       if (notice.sourceId) {
  //         return `/shift/${notice.sourceId}`;
  //       }

  //       // Если sourceId нет, но есть sourceDate — ведём на дату (создадим смену)
  //       if (notice.sourceDate) {
  //         return `/shift?date=${notice.sourceDate}`;
  //       }

  //       return undefined;
  //     case 'document':
  //       if (notice.sourceId) {
  //         return `/documents/${notice.sourceId}`;
  //       }

  //       return undefined;
  //     default:
  //       return undefined;
  //   }
  // };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <IconButton
        type='button'
        onClick={handleBackClick}
        className={styles.button}
      >
        <BackIcon className={styles.back__icon} />
      </IconButton>
      <p>Document Item Page</p>
    </>
  );
};
