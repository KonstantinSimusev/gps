import styles from './finished-shift-card.module.css';

import { useNavigate } from 'react-router-dom';

import { formatDate } from '../../../utils/utils';
import { IShift } from '../../../utils/api.interface';

interface IProps {
  shift: IShift;
}

export const FinishedShiftCard = ({ shift }: IProps) => {
  const navigate = useNavigate();

  const handleClick = (shiftId: string) => {
    navigate(`/home/shifts/${shiftId}`);
  };

  return (
    <li
      key={shift.id}
      className={styles.item}
      onClick={() => handleClick(shift.id ?? '')}
    >
      {shift ? (
        <div className={styles.wrapper__shift}>
          <span className={styles.text}>{formatDate(shift.date)}</span>
          <span className={styles.text}>Смена {shift.shiftNumber}</span>
          <span className={styles.text}>Бригада {shift.teamNumber}</span>
        </div>
      ) : (
        <span className={styles.emprty}>Нет данных</span>
      )}
      <span className={styles.text__end}>завершённая</span>
    </li>
  );
};
