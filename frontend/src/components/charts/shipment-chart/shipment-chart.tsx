import styles from './shipment-chart.module.css';

import clsx from 'clsx';

import { useEffect } from 'react';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';
import { selectShipments } from '../../../services/slices/shipment/slice';
import { getShipments } from '../../../services/slices/shipment/actions';

import { IUserShift } from '../../../utils/api.interface';
import { TShiftStatus } from '../../../utils/types';

import {
  extractNumber,
  filterWorkers,
  getCount,
  getShipmentStats,
} from '../../../utils/utils';

interface IChartProps {
  shiftId: string;
  list: IUserShift[];
  shiftStatus: string;
}

export const ShipmentChart = ({ shiftId, list, shiftStatus }: IChartProps) => {
  const dispatch = useDispatch();

  const shipments = useSelector(selectShipments);

  const activeStatusShift: TShiftStatus = 'активная';

  const total = shipments
    .filter((item) => item.location === '2 ОЧЕРЕДЬ')
    .reduce((sum, item) => sum + item.count, 0);

  const currentShiftStatus =
    shiftStatus === activeStatusShift
      ? 'данные на начало смены'
      : 'данные на конец смены';

  // Фиксированная максимальная высота столбца — 300px
  const FIXED_MAX_HEIGHT = 60;

  // Сортировка исходного массива
  const sortedArray = [...shipments].sort((a, b) => {
    const numA = extractNumber(a.railway ?? '');
    const numB = extractNumber(b.railway ?? '');
    return numA - numB;
  });

  const workersShifts = filterWorkers(list);
  const shipmentLocations = getShipmentStats(workersShifts);

  useEffect(() => {
    if (shiftId) {
      dispatch(getShipments(shiftId));
    }
  }, [shiftId]);

  return (
    <div className={styles.container}>
      {!shiftId ? (
        <Error />
      ) : (
        <>
          <div className={styles.wrapper__header}>
            <span className={styles.location}>ОТГРУЗКА</span>
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
            {sortedArray.map((item) => {
              // Если максимальное значение в данных равно 0, все столбцы будут нулевыми
              const maxDataValue =
                Math.max(...sortedArray.map((r) => r.count)) || 1;

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
                  <span className={styles.title}>{item.railway}</span>
                </li>
              );
            })}
          </ul>

          <div className={styles.wrapper__count}>
            <div className={styles.wrapper__footer}>
              <span className={styles.total__size}>Тупики 6 + 7:</span>
              <span className={styles.total__size}>{total} ваг</span>
            </div>

            <div className={styles.wrapper__footer}>
              <span className={styles.total__size}>Итого за смену:</span>
              <span className={styles.total__size}>
                {getCount(shipments)} ваг
              </span>
            </div>
          </div>

          {shiftStatus === activeStatusShift && (
            <>
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
        </>
      )}
    </div>
  );
};
