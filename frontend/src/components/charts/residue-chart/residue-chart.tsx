import styles from './residue-chart.module.css';

import clsx from 'clsx';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// import { Border } from '../../ui/border/border';

import { useDispatch, useSelector } from '../../../services/store';

import { selectResidues } from '../../../services/slices/residue/slice';
import { getResidues } from '../../../services/slices/residue/actions';

import { getCount } from '../../../utils/utils';
import { Chart } from '../../ui/chart/chart';
import { Total } from '../../ui/total/total';
import { Location } from '../../ui/location/location';

interface IChartProps {
  shiftId: string;
  shiftStatus?: string;
}

export const ResidueChart = ({ shiftId }: IChartProps) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isHome = pathname === '/home';

  const currentShiftStatus = isHome
    ? 'данные на начало смены'
    : 'данные на конец смены';

  const residues = useSelector(selectResidues);

  useEffect(() => {
    if (shiftId) {
      dispatch(getResidues(shiftId));
    }
  }, [shiftId]);

  return (
    <>
      {isHome && (
        <div className={styles.container}>
          <div className={styles.wrapper__header}>
            <Location title={'ОСТАТКИ'} />
            <span
              className={clsx(
                styles.wrapper__status,
                isHome ? styles.status__start : styles.status__end,
              )}
            >
              {currentShiftStatus}
            </span>
          </div>
          <Chart list={residues} />
          <Total count={getCount(residues)} />
        </div>
      )}
    </>
  );
};
