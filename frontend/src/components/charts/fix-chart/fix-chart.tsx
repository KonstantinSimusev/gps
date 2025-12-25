import styles from './fix-chart.module.css';

import { useEffect } from 'react';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

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
import { HeaderWrapper } from '../../ui/wrappers/header-wrapper/header-wrapper';
import { Location } from '../../ui/location/location';
import { Chart } from '../../ui/chart/chart';
import { selectLastShift } from '../../../services/slices/shift/slice';
import { getLastTeamShift } from '../../../services/slices/shift/actions';

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

  const lastShift = useSelector(selectLastShift);
  
    const fixs = lastShift?.fixs;

  const finishedStatusShift: TShiftStatus = 'завершённая';

  // 1. Проверяем, что shipments не undefined
  const total = fixs
    ? fixs
        .filter((item) => item.location === '2 ОЧЕРЕДЬ')
        .reduce((sum, item) => sum + item.count, 0)
    : 0; // значение по умолчанию, если shipments === undefined

  // 2. Проверяем shipments перед сортировкой
  const sortedArray = fixs
    ? [...fixs].sort((a, b) => {
        const numA = extractNumber(a.railway ?? '');
        const numB = extractNumber(b.railway ?? '');
        return numA - numB;
      })
    : []; // пустой массив по умолчанию

  const workersShifts = filterWorkers(list);
  const shipmentLocations = getShipmentStats(workersShifts);

  useEffect(() => {
    dispatch(getLastTeamShift());
  }, []);

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
                    {getCount(fixs ?? [])} ваг
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
