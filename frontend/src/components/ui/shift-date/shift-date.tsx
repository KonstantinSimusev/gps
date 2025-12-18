import styles from './shift-date.module.css';

import { formatDate } from '../../../utils/utils';

interface IProps {
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const ShiftDate = ({ date, shiftNumber, teamNumber }: IProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.date}>{formatDate(date)}</span>
      <span className={styles.team}>Бр-{teamNumber}</span>
      <span className={styles.shift}>См-{shiftNumber}</span>
    </div>
  );
};
