import styles from './fix-chart.module.css';

import { useEffect } from 'react';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

import { selectFixs } from '../../../services/slices/fix/slice';
import { getFixs } from '../../../services/slices/fix/actions';

import { IUserShift } from '../../../utils/api.interface';

import {
  extractNumber,
  filterWorkers,
  getCount,
  getShipmentStats,
} from '../../../utils/utils';
import { TShiftStatus } from '../../../utils/types';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { ShiftStatus } from '../../ui/shift-status/shift-status';
import { ColumnWrapper } from '../../ui/wrappers/column/column';
import { HeaderWrapper } from '../../ui/wrappers/header/header';
import { Location } from '../../ui/location/location';
import { Chart } from '../../ui/chart/chart';

interface IChartProps {
  shiftId: string;
  list: IUserShift[];
  shiftStatus: 'активная' | 'завершённая';
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const FixChart = ({
  shiftId,
  list,
  shiftStatus,
  date,
  shiftNumber,
  teamNumber,
}: IChartProps) => {
  const dispatch = useDispatch();

  const fixs = useSelector(selectFixs);

  const finishedStatusShift: TShiftStatus = 'завершённая';

  const total = fixs
    .filter((item) => item.location === '2 ОЧЕРЕДЬ')
    .reduce((sum, item) => sum + item.count, 0);

  // Сортировка исходного массива
  const sortedArray = [...fixs].sort((a, b) => {
    const numA = extractNumber(a.railway ?? '');
    const numB = extractNumber(b.railway ?? '');
    return numA - numB;
  });

  const workersShifts = filterWorkers(list);
  const shipmentLocations = getShipmentStats(workersShifts);

  useEffect(() => {
    if (shiftId) {
      dispatch(getFixs(shiftId));
    }
  }, [shiftId]);

  return (
    <>
      {shiftStatus === finishedStatusShift && (
        <div className={styles.container}>
          {!shiftId ? (
            <Error />
          ) : (
            <>
              <HeaderWrapper>
                <ShiftDate
                  date={date}
                  shiftNumber={shiftNumber}
                  teamNumber={teamNumber}
                />
                <ColumnWrapper>
                  <Location title={'РАСКРЕПЛЕНИЕ'} />
                  <ShiftStatus status={shiftStatus} />
                </ColumnWrapper>
              </HeaderWrapper>

              <Chart list={sortedArray} titleField={'railway'} />

              <div className={styles.wrapper__count}>
                <div className={styles.wrapper__footer}>
                  <span className={styles.total__size}>Тупики 6 + 7::</span>
                  <span className={styles.total__size}>{total} ваг</span>
                </div>

                <div className={styles.wrapper__footer}>
                  <span className={styles.total__size}>Итого за смену:</span>
                  <span className={styles.total__size}>
                    {getCount(fixs)} ваг
                  </span>
                </div>
              </div>

              <div className={styles.worker__wrapper}>
                <div className={styles.title__wrapper}>
                  <span className={styles.worker__title}>Раскрепление</span>
                  <span className={styles.worker__title}>Чел</span>
                </div>
                <Border />
                <ul className={styles.worker__wrapper}>
                  {shipmentLocations.length > 0 ? (
                    shipmentLocations.map((item, index) => (
                      <li className={styles.wrapper} key={index}>
                        <span>{item.workplace}</span>
                        <span className={styles.worker__count}>
                          {item.count}
                        </span>
                      </li>
                    ))
                  ) : (
                    <span className={styles.empty}>Нет данных</span>
                  )}
                </ul>
                <Border />
                <div className={styles.total__wrapper}>
                  <span>Всего:</span>
                  <span>{getCount(shipmentLocations)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
