import styles from './shift-status.module.css';

import clsx from 'clsx';

interface IProps {
  isStart: boolean;
}

export const ShiftStatus = ({ isStart }: IProps) => {
  const currentShiftStatus = isStart
    ? 'данные на начало смены'
    : 'данные на конец смены';

  return (
    <span
      className={clsx(
        styles.wrapper__status,
        isStart ? styles.status__start : styles.status__end,
      )}
    >
      {currentShiftStatus}
    </span>
  );
};
