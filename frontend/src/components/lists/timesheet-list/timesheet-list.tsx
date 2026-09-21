import { useContext } from 'react';

import { IEmployeeShift } from '../../../utils/api.interface';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { TimesheetCard } from '../../cards/timesheet-card/timesheet-card';

import styles from './timesheet-list.module.css';

interface IProps {
  employeeShifts: IEmployeeShift[];
}

export const TimesheetList = ({ employeeShifts }: IProps) => {
  const { setSelectedId, setIsOverlayOpen, setIsTimesheetEditOpen } =
    useContext(LayerContext);

  const handleClick = (id: string) => {
    setSelectedId(id);
    setIsOverlayOpen(true);
    setIsTimesheetEditOpen(true);
  };

  if (!employeeShifts || employeeShifts.length === 0) {
    return <p className={styles.empty}>Нет смен</p>;
  }

  return (
    <ul className={styles.list}>
      {employeeShifts.map((employeeShift) => (
        <li key={employeeShift.id} className={styles.item}>
          <TimesheetCard
            employeeShift={employeeShift}
            onClick={() => handleClick(employeeShift.id)}
          />
        </li>
      ))}
    </ul>
  );
};
