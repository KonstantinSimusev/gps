import { IShift } from '../../../utils/api.interfaces';
import { SCHEDULE } from '../../../utils/constants';
import { formatDateForDayUI, getDayName } from '../../../utils/utils';

import { SuccessIcon } from '../../ui/icons/success/success';

import styles from './shift-card.module.css';

interface IProps {
  shift: IShift;
  className?: string;
  onClick?: () => void;
}

export const ShiftCard = ({ shift, onClick }: IProps) => {
  const isShiftFilled =
    shift.shiftCode === null ||
    shift.employeeShifts.every((es) => es.workplaceName !== null);

  return (
    <div
      onClick={onClick}
      className={styles.card}
    >
      <div className={styles.leftContainer}>
        <div className={styles.wrapper}>
          <span className={styles.date}>{formatDateForDayUI(shift.date)}</span>
          {isShiftFilled && <SuccessIcon width={16} height={16} />}
        </div>

        {shift.scheduleCode === SCHEDULE.S_5B1 && (
          <span className={styles.shift}>
            {shift.shiftCode === null
              ? 'Выходной'
              : getDayName(shift.dayOfWeek)}
          </span>
        )}

        {shift.scheduleCode !== SCHEDULE.S_5B1 && (
          <span className={styles.shift}>
            {shift.shiftCode === null
              ? 'Выходной'
              : `Смена ${shift.shiftCode}`}
          </span>
        )}
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.raw}>
          <span className={styles.shift}>График</span>
          <span className={styles.shift}>{shift.scheduleCode}</span>
        </div>

        {shift.scheduleCode === SCHEDULE.S_9 && (
          <div className={styles.raw}>
            <span className={styles.shift}>Бригада</span>
            <span className={styles.shift}>{shift.teamNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};
