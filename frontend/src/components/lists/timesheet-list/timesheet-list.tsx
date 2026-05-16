import { useContext } from 'react';

import { IEmployee } from '../../../utils/api.interface';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { TimesheetCard } from '../../cards/timesheet-card/timesheet-card';

import styles from './timesheet-list.module.css';

interface IProps {
  employees: IEmployee[];
}

export const TimesheetList = ({ employees }: IProps) => {
  const { setSelectedId, setIsOverlayOpen, setIsTimesheetEditOpen } =
    useContext(LayerContext);

  const handleClick = (id: string) => {
    setSelectedId(id);
    setIsOverlayOpen(true);
    setIsTimesheetEditOpen(true);
  };

  if (!employees || employees.length === 0) {
    return <p className={styles.empty}>Работники не найдены</p>;
  }

  return (
    <ul className={styles.list}>
      {employees.map((employee) => (
        <li key={employee.id} className={styles.item}>
          <TimesheetCard
            employee={employee}
            onClick={() => handleClick(employee.shift.id)}
          />
        </li>
      ))}
    </ul>
  );
};
