import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { IShift } from '../../../utils/api.interface';
import { LayerContext } from '../../../contexts/layer/layerContext';
import { ShiftCard } from '../../cards/shift-card/shift-card';

import styles from './shift-list.module.css';

interface IProps {
  shifts: IShift[];
}

export const ShiftList = ({ shifts }: IProps) => {
  const navigate = useNavigate();
  const { setSelectedId } = useContext(LayerContext);

  const handleShiftClick = (shiftId: string) => {
    setSelectedId(shiftId);
    navigate(`/timesheet/${shiftId}`);
  };

  if (!shifts || shifts.length === 0) {
    return <p className={styles.empty}>Смены не найдены</p>;
  }

  return (
    <ul className={styles.list}>
      {shifts.map((shift, index) => (
        <li key={shift.id} className={styles.item}>
          <ShiftCard
            index={shifts.length - index}
            shift={shift}
            onClick={() => handleShiftClick(shift.id)}
          />
        </li>
      ))}
    </ul>
  );
};
