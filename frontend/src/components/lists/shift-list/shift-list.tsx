import styles from './shift-list.module.css';

import { useDispatch, useSelector } from '../../../services/store';
import {
  selectActiveShift,
  selectFinishedShift,
} from '../../../services/slices/shift/slice';
import { useEffect } from 'react';
import { formatDate } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import {
  getActiveShift,
  getFinishedShift,
} from '../../../services/slices/shift/actions';

export const ShiftList = () => {
  const dispatch = useDispatch();
  const activeShift = useSelector(selectActiveShift);
  const finishedShift = useSelector(selectFinishedShift);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getActiveShift());
    dispatch(getFinishedShift());
    console.log(finishedShift);
  }, []);

  const handleClick = (shiftId: string) => {
    navigate(`/home/shifts/${shiftId}`);
  };

  return (
    <ul className={styles.list}>
      {activeShift ? (
        <li
          key={activeShift.id}
          className={styles.item}
          onClick={() => handleClick(activeShift.id ?? '')}
        >
          <div className={styles.wrapper__shift}>
            <span className={styles.text}>{formatDate(activeShift.date)}</span>
            <span className={styles.text}>
              Бригада {activeShift.teamNumber}
            </span>
            <span className={styles.text}>Смена {activeShift.shiftNumber}</span>
          </div>
          <span className={styles.text__current}>активная</span>
        </li>
      ) : (
        <li className={styles.item}>
          <div className={styles.wrapper__shift}>
            <span className={styles.text}>Идет планирование...</span>
          </div>
          <span className={styles.text__current}>активная</span>
        </li>
      )}
      {finishedShift ? (
        <li
          key={finishedShift.id}
          className={styles.item}
          onClick={() => handleClick(finishedShift.id ?? '')}
        >
          <div className={styles.wrapper__shift}>
            <span className={styles.text}>
              {formatDate(finishedShift.date)}
            </span>
            <span className={styles.text}>
              Бригада {finishedShift.teamNumber}
            </span>
            <span className={styles.text}>
              Смена {finishedShift.shiftNumber}
            </span>
          </div>
          <span className={styles.text__end}>завершена</span>
        </li>
      ) : (
        <li className={styles.item}>
          <div className={styles.wrapper__shift}>
            <span className={styles.text}>Нет данных...</span>
          </div>
          <span className={styles.text__end}>завершена</span>
        </li>
      )}
    </ul>
  );
};
