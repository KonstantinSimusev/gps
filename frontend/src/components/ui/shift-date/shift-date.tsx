import styles from './shift-date.module.css';

import { formatShortDate } from '../../../utils/utils';

interface IProps {
  date: Date;
  shiftNumber: number;
  teamNumber: number;
}

export const ShiftDate = ({ date, shiftNumber, teamNumber }: IProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.date}>{formatShortDate(date)}</span>
      <span className={styles.shift}>см-{shiftNumber}</span>
      <span className={styles.team}>бр-{teamNumber}</span>
    </div>
  );
};
