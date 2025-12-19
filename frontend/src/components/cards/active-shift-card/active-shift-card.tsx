import styles from './active-shift-card.module.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Singlton } from '../../ui/singlton/singlton';

import { useDispatch, useSelector } from '../../../services/store';
import { getActiveShift } from '../../../services/slices/shift/actions';

import {
  selectActiveShift,
  selectIsLoadingActiveShift,
} from '../../../services/slices/shift/slice';

import { formatDate } from '../../../utils/utils';

export const ActiveShiftCard = () => {
  const dispatch = useDispatch();
  const activeShift = useSelector(selectActiveShift);
  const isLoadingActiveShift = useSelector(selectIsLoadingActiveShift);

  const navigate = useNavigate();

  const handleClick = (shiftId: string) => {
    navigate(`/home/shifts/${shiftId}`);
  };

  useEffect(() => {
    dispatch(getActiveShift());
  }, []);

  return (
    <li
      key={activeShift?.id}
      className={styles.item}
      onClick={() => handleClick(activeShift?.id ?? '')}
    >
      {isLoadingActiveShift ? (
        <Singlton width={146.88} height={63.2} />
      ) : activeShift ? (
        <div className={styles.wrapper__shift}>
          <span className={styles.text}>{formatDate(activeShift.date)}</span>
          <span className={styles.text}>Бригада {activeShift.teamNumber}</span>
          <span className={styles.text}>Смена {activeShift.shiftNumber}</span>
        </div>
      ) : (
        <span className={styles.emprty}>Смена не создана...</span>
      )}

      {isLoadingActiveShift ? (
        <Singlton width={67.01} height={16} />
      ) : (
        <span className={styles.text__current}>активная</span>
      )}
    </li>
  );
};
