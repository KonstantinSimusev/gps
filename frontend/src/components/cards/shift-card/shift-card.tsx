import clsx from 'clsx';

import { IShift } from '../../../utils/api.interface';
import { SCHEDULE } from '../../../utils/types';
import { formatDateForDayUI, getDayName } from '../../../utils/utils';

import { CardContainer } from '../../../components/ui/card-container/card-container';
import { SuccessIcon } from '../../ui/icons/success/success';

import styles from './shift-card.module.css';

interface IProps {
  shift: IShift;
  className?: string;
  onClick?: () => void;
}

export const ShiftCard = ({ shift, className, onClick }: IProps) => {
  return (
    <CardContainer
      onClick={onClick}
      className={clsx(styles.container, className)}
    >
      <div className={styles.date__info}>
        <div className={styles.wrapper}>
          <span className={styles.date}>{formatDateForDayUI(shift.date)}</span>
          {shift.isChecked && shift.isAssignmentComplete && (
            <SuccessIcon width={16} height={16} />
          )}
        </div>

        {shift.schedule.scheduleCode === SCHEDULE.S_5B1 && (
          <span className={styles.shift}>
            {shift.shiftSchedule === null
              ? 'Выходной'
              : getDayName(shift.shiftSchedule.dayOfWeek)}
          </span>
        )}

        {shift.schedule.scheduleCode !== SCHEDULE.S_5B1 && (
          <span className={styles.shift}>
            {shift.shiftSchedule === null
              ? 'Выходной'
              : `Смена ${shift.shiftSchedule.shiftType.shiftCode}`}
          </span>
        )}
      </div>

      <div className={styles.shift__info}>
        <div className={styles.shift__raw}>
          <span className={styles.shift}>График</span>
          <span className={styles.shift}>{shift.schedule.scheduleCode}</span>
        </div>

        {shift.schedule.scheduleCode === SCHEDULE.S_9 && (
          <div className={styles.shift__raw}>
            <span className={styles.shift}>Бригада</span>
            <span className={styles.shift}>{shift.team.teamNumber}</span>
          </div>
        )}
      </div>
    </CardContainer>
  );
};
