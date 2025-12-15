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

interface IChartProps {
  shiftId: string;
  list: IUserShift[];
  shiftStatus: string;
}

export const PackChart = ({ shiftId, list, shiftStatus }: IChartProps) => {
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

  const getMaxCount = () => {
    if (packs.length === 0) return 0; // или null, в зависимости от логики
    return Math.max(...packs.map((item) => item.count));
  };

  const MAX_VALUE = getMaxCount() + 50;

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
              <div className={styles.wrapper__header}>
                <span className={styles.location}>УПАКОВКА</span>
                <span className={styles.wrapper__status}>
                  данные на конец смены
                </span>
              </div>
              <ul className={styles.chart}>
                {transformArray.map((item) => {
                  const percentage = Math.round((item.count / MAX_VALUE) * 100);
                  return (
                    <li key={item.id} className={styles.column}>
                      <span
                        style={{ height: `${percentage}px` }}
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
