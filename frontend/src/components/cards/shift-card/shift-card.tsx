import { IShift } from '../../../utils/api.interface';
import { formatDateFormUI } from '../../../utils/utils';

import { CardContainer } from '../../../components/ui/card-container/card-container';

import styles from './shift-card.module.css';

interface IProps {
  shift: IShift;
  index: number;
  onClick: () => void;
}

export const ShiftCard = ({ index, shift, onClick }: IProps) => {
  return (
    <CardContainer onClick={onClick} className={styles.container}>
      <span className={styles.index}>{index}</span>
      <div className={styles.info}>
        <span className={styles.date}>{formatDateFormUI(shift.date)}</span>
        <span className={styles.shift}>Смена {shift.shiftNumber}</span>
      </div>
    </CardContainer>
  );
};
