import styles from './profession-info.module.css';

import { useEffect } from 'react';

import { Border } from '../ui/border/border';

import { useDispatch, useSelector } from '../../services/store';

import { selectProfessions } from '../../services/slices/user/slice';
import { getProfessions } from '../../services/slices/user/actions';

import { getCount } from '../../utils/utils';

export const ProfessionInfo = () => {
  const dispatch = useDispatch();

  const professions = useSelector(selectProfessions);
  const total = getCount(professions);

  useEffect(() => {
    dispatch(getProfessions());
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.location}>КЛС</span>
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
        <span className={styles.no__data}>Нет данных...</span>
      )}
    </div>
  );
};
