import styles from './residue-chart.module.css';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { ChartLayout } from '../../ui/layouts/chart/chart';
import { Chart } from '../../ui/chart/chart';
import { Total } from '../../ui/total/total';
import { Location } from '../../ui/location/location';
import { ShiftStatus } from '../../ui/shift-status/shift-status';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectIsLoadingResidues,
  selectResidues,
} from '../../../services/slices/residue/slice';
import { getResidues } from '../../../services/slices/residue/actions';

import { getCount } from '../../../utils/utils';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { Singlton } from '../../ui/singlton/singlton';

interface IProps {
  shiftId: string;
  shiftStatus?: string;
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const ResidueChart = ({
  shiftId,
  date,
  shiftNumber,
  teamNumber,
}: IProps) => {
  const dispatch = useDispatch();

  const isLoadingResidue = useSelector(selectIsLoadingResidues);

  const { pathname } = useLocation();
  const isHome = pathname === '/home';

  const residues = useSelector(selectResidues);

  useEffect(() => {
    if (shiftId) {
      dispatch(getResidues(shiftId));
    }
  }, [shiftId]);

  return (
    <ChartLayout>
      <div className={styles.header__wrapper}>
        <div className={styles.wrapper}>
          <Singlton
            width={184.38}
            height={56.79}
            isLoading={isLoadingResidue}
            element={
              <div className={styles.wrapper}>
                <Location title={'ОСТАТКИ'} />
                <ShiftStatus isStart={isHome} />
              </div>
            }
          />
        </div>

        <Singlton
          width={61.52}
          height={31.6}
          isLoading={isLoadingResidue}
          element={
            <ShiftDate
              date={date}
              shiftNumber={shiftNumber}
              teamNumber={teamNumber}
            />
          }
        />
      </div>

      <Singlton
        height={81}
        isLoading={isLoadingResidue}
        element={<Chart list={residues} />}
      />

      <div className={styles.total__wrapper}>
        <Singlton
          width={124.55}
          height={18.4}
          isLoading={isLoadingResidue}
          element={<Total count={getCount(residues)} />}
        />
      </div>
    </ChartLayout>
  );
};
