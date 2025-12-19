import styles from './shift-card.module.css';

import clsx from 'clsx';

import { useNavigate } from 'react-router-dom';

import { Singlton } from '../singlton/singlton';

import { formatDate } from '../../../utils/utils';
import { IShift } from '../../../utils/api.interface';

interface ICardProps {
  shift: IShift;
  status: 'активная' | 'завершённая';
  isLoading: boolean;
}

export const ShiftCard = ({ shift, status, isLoading }: ICardProps) => {
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
      {isLoading ? (
        <Singlton width={100} height={100} />
      ) : (
        shift ? (
          <div className={styles.wrapper__shift}>
            <span className={styles.text}>{formatDate(shift.date)}</span>
            <span className={styles.text}>Бригада {shift.teamNumber}</span>
            <span className={styles.text}>Смена {shift.shiftNumber}</span>
          </div>
        ) : <span className={styles.emprty}>Смена не создана...</span>
      )}

      {isLoading ? (
        <Singlton width={100} height={16} />
      ) : (
        shift && (
          <span
            className={clsx(
              status === 'активная' && styles.text__current,
              status === 'завершённая' && styles.text__end,
            )}
          >
            {status}
          </span>
        )
      )}
    </li>
  );
};
