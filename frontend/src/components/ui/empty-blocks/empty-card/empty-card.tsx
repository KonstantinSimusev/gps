import styles from './empty-card.module.css';

import clsx from 'clsx';

import { TShiftStatus } from '../../../../utils/types';

interface ICardProps {
  text: string;
  type: TShiftStatus;
}

export const EmptyCard = ({ text, type }: ICardProps) => {
  const active: TShiftStatus = 'активная';
  const finished: TShiftStatus = 'завершённая';

  return (
    <li className={styles.item}>
      <div className={styles.wrapper__shift}>
        <span className={styles.text}>{text}</span>
      </div>
      <span
        className={clsx(
          type === active && styles.text__current,
          type === finished && styles.text__end,
        )}
      >
        {type}
      </span>
    </li>
  );
};
