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

  const getMaxCount = () => {
    if (residues.length === 0) return 0; // или null, в зависимости от логики
    return Math.max(...residues.map((item) => item.count));
  };

  const MAX_VALUE = getMaxCount() + 50;

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
