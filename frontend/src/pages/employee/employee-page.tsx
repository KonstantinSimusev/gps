import { useContext, useEffect } from 'react';

import { useSelector } from '../../services/store';
import { selectSearсhEmployee } from '../../services/slices/employee/slice';

import { LayerContext } from '../../contexts/layer/layerContext';
import { EmployeeCard } from '../../components/cards/employee-card/employee-card';

// import styles from './employee-page.module.css';

export const EmployeePage = () => {
  const {
    setIsOverlayOpen,
    setIsEmployeeEditOpen,
    setIsPasswordUpdateOpen,
    setSelectedId,
  } = useContext(LayerContext);

  const employee = useSelector(selectSearсhEmployee);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const onUpdateEmployee = () => {
    if (!employee) {
      return;
    }

    setSelectedId(employee.id);
    setIsOverlayOpen(true);
    setIsEmployeeEditOpen(true);
  };

  const updatePassword = () => {
    if (!employee) {
      return;
    }

    if (employee.isActive === true) {
      setSelectedId(employee.id);
      setIsOverlayOpen(true);
      setIsPasswordUpdateOpen(true);
    }
  };

  return (
    <>
      {employee && (
        <EmployeeCard
          employee={employee}
          onUpdateEmployee={onUpdateEmployee}
          onUpdatePassword={updatePassword}
        />
      )}
    </>
  );
};
