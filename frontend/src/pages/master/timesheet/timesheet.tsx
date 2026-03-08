import { useContext, useEffect } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { getLastShift } from '../../../services/slices/shift/actions';
import { getUsersShifts } from '../../../services/slices/user-shift/actions';

import {
  selectIsLoadingLastShift,
  selectLastShift,
} from '../../../services/slices/shift/slice';
import { selectEmployee } from '../../../services/slices/auth/slice';

import { selectUsersShifts } from '../../../services/slices/user-shift/slice';

import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
import { Loader } from '../../../components/ui/loader/loader';
import { ShiftDate } from '../../../components/ui/shift-date/shift-date';
import { Button } from '../../../components/ui/button/button';
import { TeamInfo } from '../../../components/team-info/team-info';
import { UserShiftList } from '../../../components/lists/user-shift-list/user-shift-list';

import styles from './timesheet.module.css';

import { checkAccessToken } from '../../../services/slices/auth/actions';

export const Timesheet = () => {
  const { setIsOpenOverlay, setIsAddShiftOpenModall } =
    useContext(LayerContext);

  const dispatch = useDispatch();

  const employee = useSelector(selectEmployee);
  const lastShift = useSelector(selectLastShift);
  const usersShifts = useSelector(selectUsersShifts);
  const isLoadingLastShift = useSelector(selectIsLoadingLastShift);

  useEffect(() => {
    // Скролим страницу наверх
    window.scrollTo(0, 0);

    dispatch(getLastShift());
  }, []);

  useEffect(() => {
    console.log(employee);
    if (lastShift) {
      dispatch(getUsersShifts(lastShift.id));
    }
  }, [lastShift]);

  const handleClick = () => {
    setIsOpenOverlay(true);
    setIsAddShiftOpenModall(true);
  };

  const checkClick = () => {
    dispatch(checkAccessToken())
  }

  if (isLoadingLastShift) {
    return (
      <MainLayout>
        <Loader text='Загрузка' />
      </MainLayout>
    );
  }

  if (!lastShift) {
    return (
      <MainLayout>
        <a onClick={checkClick}>Hello</a>
        <div className={styles.button__wrapper}>
          <Button type='button' label='Создать смену' onClick={handleClick} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ShiftDate
        date={lastShift.date}
        shiftNumber={lastShift.shiftNumber}
        teamNumber={lastShift.teamNumber}
      />

      <TeamInfo teamNumber={lastShift.teamNumber} list={usersShifts} />

      <UserShiftList shift={lastShift} list={usersShifts} />
    </MainLayout>
  );
};
