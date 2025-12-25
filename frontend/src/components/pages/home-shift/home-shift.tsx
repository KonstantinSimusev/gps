import styles from './home-shift.module.css';

import { Loader } from '../../ui/loader/loader';
import { Error } from '../../ui/error/error';

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ShipmentChart } from '../../charts/shipment-chart/shipment-chart';
import { PackChart } from '../../charts/pack-chart/pack-chart';
import { FixChart } from '../../charts/fix-chart/fix-chart';
import { MainLayout } from '../../ui/layouts/main/main-layout';
import { TeamProfessionList } from '../../lists/profession-list/profession-list';
import { BackButton } from '../../buttons/back/back';
import { ProductionChart } from '../../charts/production-chart/production-chart';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectActiveShift,
  selectFinishedShift,
  selectIsLoadingActiveShift,
  selectIsLoadingFinishedShift,
} from '../../../services/slices/shift/slice';

import {
  getActiveShift,
  getFinishedShift,
} from '../../../services/slices/shift/actions';

import { TShiftStatus } from '../../../utils/types';

export const HomeShift = () => {
  const dispatch = useDispatch();

  const { shiftId } = useParams();

  const activeShift = useSelector(selectActiveShift);
  const finishedShift = useSelector(selectFinishedShift);

  const isLoadingActiveShift = useSelector(selectIsLoadingActiveShift);
  const isLoadingFinishedShift = useSelector(selectIsLoadingFinishedShift);

  const currentShift =
    activeShift?.id === shiftId ? activeShift : finishedShift;

  const activeStatusShift: TShiftStatus = 'активная';
  const finishedStatusShift: TShiftStatus = 'завершённая';

  const currentStatus =
    currentShift === activeShift ? activeStatusShift : finishedStatusShift;

  useEffect(() => {
    // Скролим страницу наверх
    window.scrollTo(0, 0);

    dispatch(getActiveShift());
    dispatch(getFinishedShift());
  }, []);

  if (isLoadingActiveShift && isLoadingFinishedShift) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (!currentShift || !shiftId) {
    return (
      <MainLayout>
        <div className={styles.wrapper__button}>
          <BackButton actionType='home' />
        </div>
        <Error />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.wrapper__button}>
        <BackButton actionType='home' />
      </div>

      {currentShift?.usersShifts && (
        <>
          <ProductionChart
            shift={currentShift}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
            date={currentShift.date}
            shiftNumber={currentShift.shiftNumber}
            teamNumber={currentShift.teamNumber}
          />

          <PackChart
            shift={currentShift}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
            date={currentShift.date}
            shiftNumber={currentShift.shiftNumber}
            teamNumber={currentShift.teamNumber}
          />

          <ShipmentChart
            shift={currentShift}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
            date={currentShift.date}
            shiftNumber={currentShift.shiftNumber}
            teamNumber={currentShift.teamNumber}
          />

          <FixChart
            shift={currentShift}
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
