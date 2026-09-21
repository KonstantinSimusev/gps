import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { IShift } from '../../../utils/api.interface';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch } from '../../../services/store';
import { setCheckedByShiftId } from '../../../services/slices/shift/actions';

import { ShiftCard } from '../../cards/shift-card/shift-card';

import styles from './shift-list.module.css';

interface IProps {
  shifts: IShift[];
}

export const ShiftList = ({ shifts }: IProps) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { setSelectedId } = useContext(LayerContext);

  const handleShiftClick = (shiftId: string, isChecked: boolean) => {
    setSelectedId(shiftId);
    navigate(`/shift/${shiftId}`);

    if (!isChecked) {
      dispatch(setCheckedByShiftId(shiftId));
    }
  };

  if (shifts.length === 0) {
    return <p className={styles.empty}>Нет смен</p>;
  }

  return (
    <ul className={styles.list}>
      {shifts.map((shift) => (
        <li key={shift.id} className={styles.item}>
          <ShiftCard
            shift={shift}
            onClick={() => handleShiftClick(shift.id, shift.isChecked)}
          />
        </li>
      ))}
    </ul>
  );
};
