import styles from './residue-chart.module.css';

import clsx from 'clsx';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Error } from '../../ui/error/error';
import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

import { selectResidues } from '../../../services/slices/residue/slice';
import { getResidues } from '../../../services/slices/residue/actions';

import { getCount } from '../../../utils/utils';
import { TShiftStatus } from '../../../utils/types';

interface IChartProps {
  shiftId: string;
  shiftStatus?: string;
}

export const ResidueChart = ({ shiftId, shiftStatus }: IChartProps) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isHome = pathname === '/home';

  const finishedStatusShift: TShiftStatus = 'завершённая';

  const currentShiftStatus = isHome
    ? 'данные на начало смены'
    : 'данные на конец смены';

  const residues = useSelector(selectResidues);

  // Фиксированная максимальная высота столбца — 300px
  const FIXED_MAX_HEIGHT = 60;

  useEffect(() => {
    if (shiftId) {
      dispatch(getResidues(shiftId));
    }
  }, [shiftId]);

  return (
    <>
      {shiftStatus === finishedStatusShift && (
        <div className={styles.container}>
          {!shiftId || residues.length === 0 ? (
            <Error />
          ) : (
            <>
              <div className={styles.wrapper__header}>
                <span className={styles.location}>ОСТАТКИ</span>
                <span
                  className={clsx(
                    styles.wrapper__status,
                    isHome ? styles.status__start : styles.status__end,
                  )}
                >
                  {currentShiftStatus}
                </span>
              </div>
              <ul className={styles.chart}>
                {residues.map((item) => {
                  // Если максимальное значение в данных равно 0, все столбцы будут нулевыми
                  const maxDataValue = Math.max(...residues.map(r => r.count)) || 1;
                  
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

              <div className={styles.wrapper__footer}>
                <span className={styles.total__size}>Итого:</span>
                <span className={styles.total__size}>
                  {getCount(residues)} рул
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
