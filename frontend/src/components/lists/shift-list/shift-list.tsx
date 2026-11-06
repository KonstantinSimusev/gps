import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { IShift } from '../../../utils/api.interfaces';
import { ShiftCard } from '../../cards/shift-card/shift-card';

import styles from './shift-list.module.css';

interface IProps {
  shifts: IShift[];
}

export const ShiftList = ({ shifts }: IProps) => {
  const { setSelectedId } = useContext(LayerContext);

  const navigate = useNavigate();

  const handleClick = (shiftId: string) => {
    setSelectedId(shiftId);
    navigate(`/timesheet/${shiftId}`);
  };

  return (
    <ul className={styles.list}>
      {shifts.map((shift) => (
        <li key={shift.id} className={styles.item}>
          <ShiftCard shift={shift} onClick={() => handleClick(shift.id)} />
        </li>
      ))}
    </ul>
  );
};
