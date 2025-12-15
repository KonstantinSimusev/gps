import styles from './production-chart.module.css';

import clsx from 'clsx';

import { useEffect } from 'react';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

import { selectProductions } from '../../../services/slices/production/slice';
import { getProductions } from '../../../services/slices/production/actions';

import { IUserShift } from '../../../utils/api.interface';
import { TShiftStatus } from '../../../utils/types';

import {
  countProfessionsByAttendance,
  filterAndSortProfessions,
  filterWorkers,
  getCount,
  getPackerStats,
} from '../../../utils/utils';

interface IChartProps {
  shiftId: string;
  list: IUserShift[];
  shiftStatus: string;
}

export const ProductionChart = ({
  shiftId,
  list,
  shiftStatus,
}: IChartProps) => {
  const dispatch = useDispatch();

  const productions = useSelector(selectProductions);

  const activeStatusShift: TShiftStatus = 'активная';

  const workersShifts = filterWorkers(list);
  const packerLocations = getPackerStats(workersShifts);
  const attendanceProfessions = countProfessionsByAttendance(workersShifts);
  const filterArrayByLum = filterAndSortProfessions(attendanceProfessions);

  const currentShiftStatus =
    shiftStatus === activeStatusShift
      ? 'данные на начало смены'
      : 'данные на конец смены';

  const productionTotal = productions
    .filter((item) => item.location === '2 ОЧЕРЕДЬ')
    .reduce((sum, item) => sum + item.count, 0);

  const getMaxCount = () => {
    if (productions.length === 0) return 0; // или null, в зависимости от логики
    return Math.max(...productions.map((item) => item.count));
  };

  const MAX_VALUE = getMaxCount() + 50;

  useEffect(() => {
    if (shiftId) {
      dispatch(getProductions(shiftId));
    }
  }, [shiftId]);

  return (
    <div className={styles.container}>
      {!shiftId ? (
        <Error />
      ) : (
        <>
          <div className={styles.wrapper__header}>
            <span className={styles.location}>ПРОИЗВОДСТВО</span>
            <span
              className={clsx(
                styles.wrapper__status,
                shiftStatus === activeStatusShift
                  ? styles.status__start
                  : styles.status__end,
              )}
            >
              {currentShiftStatus}
            </span>
          </div>
          <ul className={styles.chart}>
            {productions.map((item) => {
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
                  <span className={styles.title}>{item.unit}</span>
                </li>
              );
            })}
          </ul>

          <div className={styles.wrapper__count}>
            <div className={styles.wrapper__footer}>
              <span className={styles.total__size}>АНГЦ + АНО + АИ:</span>
              <span className={styles.total__size}>{productionTotal} рул</span>
            </div>

            <div className={styles.wrapper__footer}>
              <span className={styles.total__size}>Итого за смену:</span>
              <span className={styles.total__size}>
                {getCount(productions)} рул
              </span>
            </div>
          </div>

          {shiftStatus === activeStatusShift && (
            <>
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
        </>
      )}
    </div>
  );
};
