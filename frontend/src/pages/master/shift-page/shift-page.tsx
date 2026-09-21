import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import {
  createShifts,
  getShifts,
} from '../../../services/slices/shift/actions';

import { selectProfile } from '../../../services/slices/auth/slice';
import {
  selectShifts,
  selectIsGetShiftsLoading,
  selectIsCreateShiftsLoading,
} from '../../../services/slices/shift/slice';

import { InfoBlock } from '../../../components/ui/info-block/info-block';
import { Loader } from '../../../components/ui/loader/loader';
import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
import { ShiftList } from '../../../components/lists/shift-list/shift-list';

import styles from './shift-page.module.css';

export const ShiftPage = () => {
  const dispatch = useDispatch();

  const profile = useSelector(selectProfile);
  const shifts = useSelector(selectShifts);

  const isCreateShiftsLoading = useSelector(selectIsCreateShiftsLoading);
  const isGetShiftsLoading = useSelector(selectIsGetShiftsLoading);

  const isLoading = isCreateShiftsLoading || isGetShiftsLoading;

  if (profile === null) {
    return null;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    (async () => {
      await dispatch(createShifts());
      await dispatch(getShifts());

      // await dispatch(checkMissingShifts());
      // await dispatch(checkPendingShifts());

      // дальше на странице собщений по кнопке СОЗДАТЬ метод
      // await dispatch(createMissingShift());
      
    })();
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

      {isLoading ? (
        <Loader text='Загрузка' />
      ) : (
        <div className={styles.list__container}>
          {shifts && shifts.length > 0 ? (
            <ShiftList shifts={shifts} />
          ) : (
            <p className={styles.empty}>Смен нет</p>
          )}
        </div>
      )}
    </MainLayout>
  );
};
