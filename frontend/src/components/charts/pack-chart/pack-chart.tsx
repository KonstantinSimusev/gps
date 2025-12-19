import styles from './pack-chart.module.css';

import { useEffect } from 'react';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

import { selectPacks } from '../../../services/slices/pack/slice';
import { getPacks } from '../../../services/slices/pack/actions';

import { IUserShift } from '../../../utils/api.interface';

import {
  countProfessionsByAttendance,
  filterAndSortProfessions,
  filterWorkers,
  getCount,
  getPackerStats,
  transformLocations,
} from '../../../utils/utils';
import { TShiftStatus } from '../../../utils/types';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { ShiftStatus } from '../../ui/shift-status/shift-status';
import { ColumnWrapper } from '../../ui/wrappers/column/column';
import { HeaderWrapper } from '../../ui/wrappers/header/header';
import { Location } from '../../ui/location/location';

interface IChartProps {
  shiftId: string;
  list: IUserShift[];
  shiftStatus: 'активная' | 'завершённая';
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const PackChart = ({
  shiftId,
  list,
  shiftStatus,
  date,
  shiftNumber,
  teamNumber,
}: IChartProps) => {
  const dispatch = useDispatch();

  const packs = useSelector(selectPacks);

  const finishedStatusShift: TShiftStatus = 'завершённая';

  const total = packs
    .filter((item) => item.location === '2 ОЧЕРЕДЬ')
    .reduce((sum, item) => sum + item.count, 0);

  const transformArray = transformLocations(packs);

  const workersShifts = filterWorkers(list);
  const packerLocations = getPackerStats(workersShifts);
  const attendanceProfessions = countProfessionsByAttendance(workersShifts);
  const filterArrayByLum = filterAndSortProfessions(attendanceProfessions);

  // Фиксированная максимальная высота столбца — 300px
  const FIXED_MAX_HEIGHT = 60;

  useEffect(() => {
    if (shiftId) {
      dispatch(getPacks(shiftId));
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
                  <Location title={'УПАКОВКА'} />
                  <ShiftStatus status={shiftStatus} />
                </ColumnWrapper>
              </HeaderWrapper>
             
              <ul className={styles.chart}>
                {transformArray.map((item) => {
                  // Если максимальное значение в данных равно 0, все столбцы будут нулевыми
                  const maxDataValue =
                    Math.max(...transformArray.map((r) => r.count)) || 1;

                  // Вычисляем высоту столбца в процентах от 300px
                  const percentage = (item.count / maxDataValue) * 100;

                  // Переводим процент в пиксели (от 0 до 300)
                  const heightInPx = (percentage / 100) * FIXED_MAX_HEIGHT;

                  return (
                    <li key={item.id} className={styles.column}>
                      <span
                        style={{ height: `${heightInPx}px` }}
                        className={styles.column__height}
                      >
                        <span className={styles.count}>
                          {item.count > 0 ? item.count : ''}
                        </span>
                      </span>
                      <Border />
                      <span className={styles.title}>{item.location}</span>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.wrapper__count}>
                <div className={styles.wrapper__footer}>
                  <span className={styles.total__size}>2 ОЧ + ЛУМ:</span>
                  <span className={styles.total__size}>{total} рул</span>
                </div>

                <div className={styles.wrapper__footer}>
                  <span className={styles.total__size}>Итого за смену:</span>
                  <span className={styles.total__size}>
                    {getCount(packs)} рул
                  </span>
                </div>
              </div>

              <div className={styles.worker__wrapper}>
                <div className={styles.title__wrapper}>
                  <span className={styles.worker__title}>Ручная упаковка</span>
                  <span className={styles.worker__title}>Чел</span>
                </div>
                <Border />
                <ul className={styles.worker__wrapper}>
                  {packerLocations.length > 0 ? (
                    packerLocations.map((item, index) => (
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
                  <span>{getCount(packerLocations)}</span>
                </div>
              </div>

              <div className={styles.worker__wrapper}>
                <div className={styles.title__wrapper}>
                  <span className={styles.worker__title}>ЛУМ</span>
                  <span className={styles.worker__title}>Чел</span>
                </div>
                <Border />
                <ul className={styles.worker__wrapper}>
                  {filterArrayByLum.length > 0 ? (
                    filterArrayByLum.map((item, index) => (
                      <li className={styles.wrapper} key={index}>
                        <span>{item.profession}</span>
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
                  <span>{getCount(filterArrayByLum)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
