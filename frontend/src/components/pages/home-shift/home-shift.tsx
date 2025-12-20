import styles from './home-shift.module.css';

import { BackButton } from '../../buttons/back/back';
import { ProductionChart } from '../../charts/production-chart/production-chart';
import { useParams } from 'react-router-dom';
import { ShiftInfo } from '../../shift-info/shift-info';
import { useDispatch, useSelector } from '../../../services/store';
import {
  selectActiveShift,
  selectFinishedShift,
  selectIsLoadingShift,
} from '../../../services/slices/shift/slice';
import { Error } from '../../ui/error/error';
import { MainLayout } from '../../ui/layouts/main/main-layout';
import { TeamProfessionList } from '../../lists/profession-list/profession-list';
import { useEffect } from 'react';
import { TShiftStatus } from '../../../utils/types';
import { ShipmentChart } from '../../charts/shipment-chart/shipment-chart';
import { PackChart } from '../../charts/pack-chart/pack-chart';
import { FixChart } from '../../charts/fix-chart/fix-chart';
import {
  getActiveShift,
  getFinishedShift,
} from '../../../services/slices/shift/actions';

export const HomeShift = () => {
  const dispatch = useDispatch();

  const { shiftId } = useParams();

  const activeShift = useSelector(selectActiveShift);
  const finishedShift = useSelector(selectFinishedShift);
  const isLoadingShift = useSelector(selectIsLoadingShift);

  useEffect(() => {
    // Скролим страницу наверх
    window.scrollTo(0, 0);
    dispatch(getActiveShift());
    dispatch(getFinishedShift());
  }, []);

  // 1. Сначала проверяем shiftId
  if (!shiftId) {
    return <Error />;
  }

  // 2. Затем проверяем загрузку
  if (isLoadingShift) {
    return (
      <MainLayout>
        <div className={styles.wrapper__button}>
          <BackButton actionType="home" />
        </div>
        <Error />
      </MainLayout>
    );
  }

  // 3. Ищем нужную смену
  const currentShift =
    activeShift?.id === shiftId ? activeShift : finishedShift;

  // 4. Если смены нет после загрузки — показываем пустой контейнер
  if (!currentShift) {
    return (
      <MainLayout>
        <div className={styles.wrapper__button}>
          <BackButton actionType="home" />
        </div>
        <Error />
      </MainLayout>
    );
  }

  const activeStatusShift: TShiftStatus = 'активная';
  const finishedStatusShift: TShiftStatus = 'завершённая';

  const currentStatus =
    currentShift === activeShift ? activeStatusShift : finishedStatusShift;

  return (
    <MainLayout>
      <div className={styles.wrapper__button}>
        <BackButton actionType="home" />
      </div>

      {currentShift && (
        <ShiftInfo
          date={currentShift.date}
          shiftNumber={currentShift.shiftNumber}
          teamNumber={currentShift.teamNumber}
        />
      )}

      {currentShift?.usersShifts && (
        <>
          <ProductionChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
            date={currentShift.date}
            shiftNumber={currentShift.shiftNumber}
            teamNumber={currentShift.teamNumber}
          />

          <PackChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
            date={currentShift.date}
            shiftNumber={currentShift.shiftNumber}
            teamNumber={currentShift.teamNumber}
          />

          <ShipmentChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
            date={currentShift.date}
            shiftNumber={currentShift.shiftNumber}
            teamNumber={currentShift.teamNumber}
          />

          <FixChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
            date={currentShift.date}
            shiftNumber={currentShift.shiftNumber}
            teamNumber={currentShift.teamNumber}
          />

          <TeamProfessionList
            type={currentStatus}
            list={currentShift?.usersShifts}
            teamNumber={currentShift.teamNumber}
          />
        </>
      )}
    </MainLayout>
  );
};
