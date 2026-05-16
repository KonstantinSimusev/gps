import { useContext, useEffect } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { MainLayout } from '../../../components/ui/layouts/main/main-layout';

import { IconButton } from '../../../components/ui/buttons/icon-button/icon-button';
import { InfoBlock } from '../../../components/ui/info-block/info-block';
import { ShiftList } from '../../../components/lists/shift-list/shift-list';

import { AddIcon } from '../../../components/ui/icons/add/add';

import styles from './shift-page.module.css';

import { shiftData, masterData } from '../../../utils/memory';

export const ShiftPage = () => {
  const { setIsOverlayOpen, setIsShiftAddOpen } = useContext(LayerContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleAddClick = () => {
    setIsOverlayOpen(true);
    setIsShiftAddOpen(true);
  };

  return (
    <MainLayout>
      <div className={styles.master}>
        <InfoBlock
          title='Руководитель'
          text={`${masterData.lastName} ${masterData.firstName} ${masterData.patronymic}`}
        />
       
        <InfoBlock title='Должность' text={masterData.profession} />
        
        <InfoBlock
          title='Структурное подразделение'
          text={`УУМ ${masterData.workshopCode}`}
        />
       
        <InfoBlock title='№ бригады' text={masterData.teamNumber} />
        
      </div>

      <IconButton
        type='button'
        onClick={handleAddClick}
        className={styles.button}
      >
        <AddIcon className={styles.add__icon} />
      </IconButton>

      <ShiftList shifts={shiftData.shifts} />
    </MainLayout>
  );
};
