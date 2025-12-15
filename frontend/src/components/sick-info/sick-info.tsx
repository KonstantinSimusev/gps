import styles from './sick-info.module.css';

import { useEffect } from 'react';

import { Border } from '../ui/border/border';

import { useDispatch, useSelector } from '../../services/store';

import { getLastShiftsTeams } from '../../services/slices/shift/actions';
import { selectLastShiftsTeams } from '../../services/slices/shift/slice';

import { countProfessionsBySickLeave, getCount } from '../../utils/utils';

export const SickInfo = () => {
  const dispatch = useDispatch();

  const lastShiftsTeams = useSelector(selectLastShiftsTeams);
  const professions = countProfessionsBySickLeave(lastShiftsTeams);
  const total = getCount(professions);

  useEffect(() => {
    dispatch(getLastShiftsTeams());
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.location}>БОЛЬНИЧНЫЙ ЛИСТ</span>
      {total > 0 ? (
        <>
          <ul className={styles.wrapper__list}>
            <div className={styles.title__wrapper}>
              <span className={styles.worker__title}>Профессия</span>
              <span className={styles.worker__title}>Чел</span>
            </div>
            <Border />
            {professions.map((item, index) => (
              <li className={styles.wrapper} key={index}>
                <span className={styles.text}>{item.profession}</span>
                <span className={styles.count}>{item.count}</span>
              </li>
            ))}
            <Border />
            <div className={styles.total__employees}>
              <span>Всего:</span>
              <span className={styles.total}>{total}</span>
            </div>
          </ul>
        </>
      ) : (
        <span className={styles.no__sick}>Все здоровые...</span>
      )}
    </div>
  );
};
