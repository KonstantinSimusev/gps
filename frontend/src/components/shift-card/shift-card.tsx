import styles from './shift-card.module.css';
import clsx from 'clsx';

import { useNavigate } from 'react-router-dom';

import { TShiftStatus } from '../../utils/types';
import { formatDate } from '../../utils/utils';
import { Singlton } from '../ui/singlton/singlton';

interface ICardProps {
  id: string;
  date: Date;
  shiftNumber: number;
  teamNumber: number;
  type: TShiftStatus;
  isLoading: boolean;
}

export const ShiftCard = ({
  id,
  date,
  shiftNumber,
  teamNumber,
  type,
  isLoading,
}: ICardProps) => {
  const navigate = useNavigate();

  const active: TShiftStatus = 'активная';
  const finished: TShiftStatus = 'завершённая';

  const handleClick = (shiftId: string) => {
    navigate(`/home/shifts/${shiftId}`);
  };

  return (
    <li key={id} className={styles.item} onClick={() => handleClick(id)}>
      <Singlton
        width={147.34}
        height={63.2}
        isLoading={isLoading}
        element={
          <div className={styles.wrapper__shift}>
            <span className={styles.text}>{formatDate(date)}</span>
            <span className={styles.text}>Бригада {teamNumber}</span>
            <span className={styles.text}>Смена {shiftNumber}</span>
          </div>
        }
      />

      <Singlton
        width={67.01}
        height={16}
        isLoading={isLoading}
        element={
          <span
            className={clsx(
              type === active && styles.text__current,
              type === finished && styles.text__end,
            )}
          >
            {type}
          </span>
        }
      />
    </li>
  );
};
