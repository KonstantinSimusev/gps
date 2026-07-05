import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../../services/store';
import { selectProfile } from '../../../services/slices/auth/slice';

import { InfoBlock } from '../../../components/ui/info-block/info-block';
import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
// import { ShiftList } from '../../../components/lists/shift-list/shift-list';

import styles from './shift-page.module.css';
import { createShift } from '../../../services/slices/shift/actions';

export const ShiftPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  if (profile === null) {
    return null;
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    dispatch(createShift())
  }, []);

  return (
    <MainLayout>
      <div className={styles.master}>
        <InfoBlock
          title='Структурное подразделение'
          text={`УУМ ${profile?.workshopCode}`}
        />

        <InfoBlock title='№ бригады' text={`${profile?.teamNumber}`} />

        <InfoBlock
          title='Руководитель'
          text={`${profile?.lastName} ${profile?.firstName} ${profile?.patronymic}`}
        />

        <InfoBlock title='Должность' text={profile?.profession || ''} />
      </div>

      {/* <ShiftList shifts={[shift]} /> */}
    </MainLayout>
  );
};
