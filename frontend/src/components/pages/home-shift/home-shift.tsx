import styles from './home-shift.module.css';

import { BackButton } from '../../buttons/back/back';
import { ProductionChart } from '../../charts/production-chart/production-chart';
import { useParams } from 'react-router-dom';
import { ShiftInfo } from '../../shift-info/shift-info';
import { useSelector } from '../../../services/store';
import {
  selectActiveShift,
  selectFinishedShift,
} from '../../../services/slices/shift/slice';
import { Error } from '../../ui/error/error';
import { Layout } from '../../ui/layout/layout';
import { TeamProfessionList } from '../../lists/profession-list/profession-list';
import { useEffect } from 'react';
import { TShiftStatus } from '../../../utils/types';
import { ShipmentChart } from '../../charts/shipment-chart/shipment-chart';
import { PackChart } from '../../charts/pack-chart/pack-chart';
import { FixChart } from '../../charts/fix-chart/fix-chart';
import { ResidueChart } from '../../charts/residue-chart/residue-chart';

export const HomeShift = () => {
  const { shiftId } = useParams();

  useEffect(() => {
    // Скролим страницу наверх
    window.scrollTo(0, 0);
  }, []);

  if (!shiftId) {
    return <Error />;
  }

  const activeShift = useSelector(selectActiveShift);
  const finishedShift = useSelector(selectFinishedShift);

  const activeStatusShift: TShiftStatus = 'активная';
  const finishedStatusShift: TShiftStatus = 'завершённая';

  const currentShift =
    activeShift?.id === shiftId ? activeShift : finishedShift;

  const currentStatus =
    currentShift === activeShift ? activeStatusShift : finishedStatusShift;

  return (
    <Layout>
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
          <TeamProfessionList
            type={currentStatus}
            list={currentShift?.usersShifts}
            teamNumber={currentShift.teamNumber}
          />

          <ProductionChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
          />

          <PackChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
          />

          <ResidueChart shiftId={shiftId} shiftStatus={currentStatus} />

          <ShipmentChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
          />

          <FixChart
            shiftId={shiftId}
            list={currentShift?.usersShifts}
            shiftStatus={currentStatus}
          />
        </>
      )}
    </Layout>
  );
};
