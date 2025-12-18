import styles from './production-chart.module.css';

import { useEffect } from 'react';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

import { ShiftStatus } from '../../ui/shift-status/shift-status';

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
import { ShiftDate } from '../../ui/shift-date/shift-date';

interface IChartProps {
  shiftId: string;
  list: IUserShift[];
  shiftStatus: string;
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const ProductionChart = ({
  shiftId,
  list,
  shiftStatus,
  date,
  shiftNumber,
  teamNumber,
}: IChartProps) => {
  const dispatch = useDispatch();

  const productions = useSelector(selectProductions);

  const activeStatusShift: TShiftStatus = 'активная';

  const workersShifts = filterWorkers(list);
  const packerLocations = getPackerStats(workersShifts);
  const attendanceProfessions = countProfessionsByAttendance(workersShifts);
  const filterArrayByLum = filterAndSortProfessions(attendanceProfessions);

  const productionTotal = productions
    .filter((item) => item.location === '2 ОЧЕРЕДЬ')
    .reduce((sum, item) => sum + item.count, 0);

  // Фиксированная максимальная высота столбца — 300px
  const FIXED_MAX_HEIGHT = 60;

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
            <ShiftStatus isStart={shiftStatus === activeStatusShift} />
            <ShiftDate
              date={date}
              shiftNumber={shiftNumber}
              teamNumber={teamNumber}
            />
          </div>

          <ul className={styles.chart}>
            {productions.map((item) => {
              // Если максимальное значение в данных равно 0, все столбцы будут нулевыми
              const maxDataValue =
                Math.max(...productions.map((r) => r.count)) || 1;

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
