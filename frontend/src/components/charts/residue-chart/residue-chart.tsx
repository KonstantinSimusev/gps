import styles from './residue-chart.module.css';

import { useLocation } from 'react-router-dom';

import { ChartLayout } from '../../ui/layouts/chart/chart';
import { Chart } from '../../ui/chart/chart';
import { Total } from '../../ui/total/total';
import { Location } from '../../ui/location/location';
import { ShiftStatus } from '../../ui/shift-status/shift-status';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { Singlton } from '../../ui/singlton/singlton';
import { HeaderWrapper } from '../../ui/wrappers/header/header';
import { ColumnWrapper } from '../../ui/wrappers/column/column';

import { getFinishedShift } from '../../../services/slices/shift/actions';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../services/store';
import {
  selectFinishedShift,
  selectIsLoadingFinishedShift,
} from '../../../services/slices/shift/slice';

import { getCount } from '../../../utils/utils';
import { TShiftStatus } from '../../../utils/types';

export const ResidueChart = () => {
  const dispatch = useDispatch();
  const finishedShift = useSelector(selectFinishedShift);
  const isLoadingFinishedShift = useSelector(selectIsLoadingFinishedShift);
  
  // Отображаем только на главной странице
  const { pathname } = useLocation();
  const isHome = pathname === '/home';

  const sortedArray = finishedShift?.residues
    ? finishedShift.residues.slice().sort((a, b) => {
        const aOrder = a.sortOrder ?? 0; // если undefined → берём 0
        const bOrder = b.sortOrder ?? 0;
        return aOrder - bOrder;
      })
    : [];


  const finished: TShiftStatus = 'завершённая';

  useEffect(() => {
    dispatch(getFinishedShift());
  }, []);

  return (
    <>
      {isHome && (
        <ChartLayout>
          <HeaderWrapper>
            {isLoadingFinishedShift ? (
              <Singlton width={206} height={16.09} />
            ) : (
              finishedShift && (
                <ShiftDate
                  date={finishedShift.date}
                  shiftNumber={finishedShift.shiftNumber}
                  teamNumber={finishedShift.teamNumber}
                />
              )
            )}

            {isLoadingFinishedShift ? (
              <Singlton width={190} height={40.79} />
            ) : (
              <ColumnWrapper>
                <Location title={'ОСТАТКИ'} />
                <ShiftStatus status={finished} />
              </ColumnWrapper>
            )}
          </HeaderWrapper>

          {isLoadingFinishedShift ? (
            <Singlton height={81} />
          ) : (
            finishedShift && (
              <Chart list={sortedArray ?? []} titleField={'location'} />
            )
          )}

          {isLoadingFinishedShift ? (
            <div className={styles.total__wrapper}>
              <Singlton width={135} height={18.4} />
            </div>
          ) : (
            finishedShift && (
              <Total count={getCount(sortedArray)} />
            )
          )}
        </ChartLayout>
      )}
    </>
  );
};
