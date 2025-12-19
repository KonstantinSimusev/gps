import styles from './shift-status.module.css';

import clsx from 'clsx';

interface IProps {
  status: 'активная' | 'завершённая';
}

export const ShiftStatus = ({ status }: IProps) => {
  const startData = 'данные на начало смены';
  const endDate = 'данные на конец смены';

  return (
    <span
      className={clsx(
        styles.wrapper__status,
        status === 'активная' && styles.status__start,
        status === 'завершённая' && styles.status__end,
      )}
    >
      {status === 'активная' && startData}
      {status === 'завершённая' && endDate}
    </span>
  );
};
