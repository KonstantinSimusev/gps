import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch, useSelector } from '../../../services/store';

import { getEmployeeShiftsByShiftId } from '../../../services/slices/employee-shift/actions';
import { getShiftById } from '../../../services/slices/shift/actions';

import {
  selectEmployeeShifts,
  selectIsAssignmentComplete,
  selectIsEmployeeShiftsLoading,
} from '../../../services/slices/employee-shift/slice';

import { selectShift } from '../../../services/slices/shift/slice';

import { IconButton } from '../../../components/ui/buttons/icon-button/icon-button';
import { Loader } from '../../../components/ui/loader/loader';
import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
import { ShiftCard } from '../../../components/cards/shift-card/shift-card';
import { TimesheetList } from '../../../components/lists/timesheet-list/timesheet-list';

import { AddIcon } from '../../../components/ui/icons/add/add';
import { BackIcon } from '../../../components/ui/icons/back/back';
import { SuccessIcon } from '../../../components/ui/icons/success/success';

import styles from './timesheet-page.module.css';

export const TimesheetPage = () => {
  const { setIsOverlayOpen, setIsEmployeeAddOpen, setSelectedDate } =
    useContext(LayerContext);

  const { shiftId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const shift = useSelector(selectShift);
  const employeeShifts = useSelector(selectEmployeeShifts);
  const isAssignmentComplete = useSelector(selectIsAssignmentComplete);
  const isLoading = useSelector(selectIsEmployeeShiftsLoading);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    if (shiftId) {
      dispatch(getEmployeeShiftsByShiftId(shiftId));
      dispatch(getShiftById({ id: shiftId }));
    }
  }, []);

  // Если идёт загрузка — показываем лоадер
  if (isLoading) {
    return (
      <MainLayout>
        <Loader text='Загрузка' />
      </MainLayout>
    );
  }

  if (!shiftId || !employeeShifts || employeeShifts.length === 0) {
    return (
      <MainLayout>
        <div className={styles.error}>Смен нет</div>
      </MainLayout>
    );
  }

  const handleBackClick = () => {
    if (shift) {
      setSelectedDate(shift.date);
    }

    navigate(-1);
  };

  const handleAddClick = () => {
    setIsOverlayOpen(true);
    setIsEmployeeAddOpen(true);
  };

  return (
    <MainLayout>
      <div className={styles.buttons}>
        <IconButton
          type='button'
          onClick={handleBackClick}
          className={styles.button}
        >
          <BackIcon className={styles.back__icon} />
        </IconButton>

        <IconButton
          type='button'
          onClick={handleAddClick}
          className={styles.button}
        >
          <AddIcon className={styles.add__icon} />
        </IconButton>
      </div>

      {shift !== null && <ShiftCard shift={shift} />}

      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.success}>
            <span className={styles.text}>Отмечено работников</span>
            {isAssignmentComplete && <SuccessIcon />}
          </div>

          <span className={styles.total}>
            <span className={styles.total__count}>{3}</span>
            <span className={styles.total__text}>из</span>
            <span className={styles.total__count}>{employeeShifts.length}</span>
          </span>
        </div>
      </div>

      <TimesheetList employeeShifts={employeeShifts} />
    </MainLayout>
  );
};
