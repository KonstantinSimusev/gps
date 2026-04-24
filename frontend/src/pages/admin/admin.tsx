import { useContext } from 'react';

import { LayerContext } from '../../contexts/layer/layerContext';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';
import { ProfileCard } from '../../components/cards/profile-card/profile-card';
import { IconButton } from '../../components/ui/icon-button/icon-button';
import { AddIcon } from '../../components/ui/icons/add/add';
import { SearchIcon } from '../../components/ui/icons/search/search';

import styles from './admin.module.css';

export const Admin = () => {
  const { setIsOverlayOpen, setIsEmployeeSearchOpen, setIsEmployeeCreateOpen } =
    useContext(LayerContext);

  const createEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeCreateOpen(true);
  };

  const searchEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeSearchOpen(true);
  };
  return (
    <MainLayout>
      <div className={styles.container}>
        <IconButton type='button' onClick={createEmployee}>
          <AddIcon width={24} height={24} />
        </IconButton>
        <IconButton type='button' onClick={searchEmployee}>
          <SearchIcon width={22} height={22} />
        </IconButton>
      </div>

      {/* <div className={styles.buttons__wrapper}>
        <Button
          className={styles.button}
          type='button'
          onClick={searchEmployee}
        >
          <SearchIcon width={16} height={16} />
          Поиск
        </Button>

        <Button
          className={styles.button}
          type='button'
          onClick={createEmployee}
        >
          <AddIcon width={16} height={16} />
          Создать
        </Button>
      </div> */}

      <ProfileCard />
    </MainLayout>
  );
};
