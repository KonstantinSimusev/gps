import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Border } from '../../../components/ui/border/border';
import { IconButton } from '../../../components/ui/buttons/icon-button/icon-button';
import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
import { TimesheetList } from '../../../components/lists/timesheet-list/timesheet-list';

import { AddIcon } from '../../../components/ui/icons/add/add';
import { BackIcon } from '../../../components/ui/icons/back/back';
import { SuccessIcon } from '../../../components/ui/icons/success/success';

import styles from './timesheet-page.module.css';

import { employeesData } from '../../../utils/memory';

export const TimesheetPage = () => {
  const navigate = useNavigate();
  const { setIsOverlayOpen, setIsEmployeeAddOpen } = useContext(LayerContext);

  const isActive = true;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleBackClick = () => {
    navigate('/timesheet');
  };

  const handleAddClick = () => {
    setIsOverlayOpen(true);
    setIsEmployeeAddOpen(true);
  };

  return (
    <MainLayout>
      <div className={styles.buttons}>
        <IconButton
          type='button'
          onClick={handleBackClick}
          className={styles.button}
        >
          <BackIcon className={styles.back__icon} />
        </IconButton>

        <IconButton
          type='button'
          onClick={handleAddClick}
          className={styles.button}
        >
          <AddIcon className={styles.add__icon} />
        </IconButton>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.success}>
            <span className={styles.text}>Отмечено работников</span>
            {isActive && (
              <div className={styles.position}>
                <SuccessIcon />
              </div>
            )}
          </div>

          <span className={styles.total}>{'24'}</span>
        </div>
        <Border />
      </div>

      <TimesheetList employees={employeesData.employees} />
    </MainLayout>
  );
};
