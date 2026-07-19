import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import {
  createShift,
  getCurrentShifts,
} from '../../../services/slices/shift/actions';

import { selectProfile } from '../../../services/slices/auth/slice';
import { selectCurrentShifts } from '../../../services/slices/shift/slice';

import { InfoBlock } from '../../../components/ui/info-block/info-block';
import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
import { ShiftList } from '../../../components/lists/shift-list/shift-list';

import styles from './shift-page.module.css';

export const ShiftPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const shifts = useSelector(selectCurrentShifts);

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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const init = async () => {
      // 1. Пытаемся создать смены. Ошибки "уже есть" игнорируем, // потому что для отображения они не критичны.
      try {
        await dispatch(createShift());
      } catch (error) {
        // Логируем, но не прерываем поток: главное — показать данные.
        console.warn(error);
      }

      // 2. Гарантированно получаем смены. Этот вызов должен быть всегда.
      try {
        await dispatch(getCurrentShifts());
      } catch (error) {
        console.error(error);
      }
    };

    init();
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

      <ShiftList shifts={shifts} />
    </MainLayout>
  );
};
