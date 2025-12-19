import styles from './finished-shift-card.module.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import { Singlton } from '../../ui/singlton/singlton';

import { useDispatch, useSelector } from '../../../services/store';
import { getFinishedShift } from '../../../services/slices/shift/actions';

import {
  selectFinishedShift,
  // selectIsLoadingFinishedShift,
} from '../../../services/slices/shift/slice';

import { formatDate } from '../../../utils/utils';

export const FinishedShiftCard = () => {
  const dispatch = useDispatch();
  const finishedShift = useSelector(selectFinishedShift);
  // const isLoadingFinishedShift = useSelector(selectIsLoadingFinishedShift);

  const navigate = useNavigate();

  const handleClick = (shiftId: string) => {
    navigate(`/home/shifts/${shiftId}`);
  };

  useEffect(() => {
    dispatch(getFinishedShift());
  }, []);

  return (
    <li
      key={finishedShift?.id}
      className={styles.item}
      onClick={() => handleClick(finishedShift?.id ?? '')}
    >
      {finishedShift ? (
        <div className={styles.wrapper__shift}>
          <span className={styles.text}>{formatDate(finishedShift.date)}</span>
          <span className={styles.text}>
            Бригада {finishedShift.teamNumber}
          </span>
          <span className={styles.text}>Смена {finishedShift.shiftNumber}</span>
        </div>
      ) : (
        <span className={styles.emprty}>Смена не создана...</span>
      )}

      {/* {isLoadingFinishedShift ? (
        <Singlton width={146.88} height={63.2} />
      ) : finishedShift ? (
        <div className={styles.wrapper__shift}>
          <span className={styles.text}>{formatDate(finishedShift.date)}</span>
          <span className={styles.text}>
            Бригада {finishedShift.teamNumber}
          </span>
          <span className={styles.text}>Смена {finishedShift.shiftNumber}</span>
        </div>
      ) : (
        <span className={styles.emprty}>Смена не создана...</span>
      )} */}

      {finishedShift && (
          <span className={styles.text__end}>завершённая</span>
        )}

      {/* {isLoadingFinishedShift ? (
        <Singlton width={99.6} height={16} />
      ) : (
        finishedShift && (
          <span className={styles.text__end}>завершённая</span>
        )
      )} */}
    </li>
  );
};
