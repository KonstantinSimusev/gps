import { useContext } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { IEmployeeShift } from '../../../utils/api.interfaces';
import { EmployeeShiftCard } from '../../cards/employee-shift-card/employee-shift-card';

import styles from './employee-shift-list.module.css';

interface IProps {
  employeeShifts: IEmployeeShift[];
}

export const EmployeeShiftList = ({ employeeShifts }: IProps) => {
  const {
    setSelectedId,
    setIsOverlayOpen,
    setIsEmployeeShiftEditOpen,
    setIsEmployeeShiftDeleteOpen,
  } = useContext(LayerContext);

  const handleEditClick = (id: string) => {
    setSelectedId(id);
    setIsOverlayOpen(true);
    setIsEmployeeShiftEditOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsOverlayOpen(true);
    setIsEmployeeShiftDeleteOpen(true);
  };

  return (
    <ul className={styles.list}>
      {employeeShifts.map((employeeShift) => (
        <li key={employeeShift.id} className={styles.item}>
          <EmployeeShiftCard
            employeeShift={employeeShift}
            onClick={() => handleEditClick(employeeShift.id)}
            onDelete={() => handleDeleteClick(employeeShift.id)}
          />
        </li>
      ))}
    </ul>
  );
};
