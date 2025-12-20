import styles from './timesheet.module.css';

import { useEffect, useState } from 'react';

import { MainLayout } from '../../ui/layouts/main/main-layout';
import { PageTitle } from '../../ui/page-title/page-title';
import { ShiftInfo } from '../../shift-info/shift-info';
import { TeamProfessionList } from '../../lists/profession-list/profession-list';
import { UserShiftList } from '../../lists/user-shift-list/user-shift-list';
import { AddButton } from '../../buttons/add/add-button';

import { useDispatch, useSelector } from '../../../services/store';
import {
  selectCurrentShift,
  selectCurrentShiftId,
} from '../../../services/slices/shift/slice';
import { getLastTeamShift } from '../../../services/slices/shift/actions';
import { selectUsersShifts } from '../../../services/slices/user-shift/slice';
import { isShowShift } from '../../../utils/utils';
import { Loader } from '../../ui/loader/loader';

export const Timesheet = () => {
  const dispatch = useDispatch();
  const lastShift = useSelector(selectCurrentShift);
  const usersShifts = useSelector(selectUsersShifts);
  const currentShiftId = useSelector(selectCurrentShiftId);

  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Перед запросом устанавливаем загрузку
    setIsLoading(true);
    dispatch(getLastTeamShift())
      .unwrap()
      .catch(() => {
        // Даже если ошибка — снимаем загрузку
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <PageTitle title="ТАБЕЛЬ" />
        <Loader />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTitle title="ТАБЕЛЬ" />
      {(!lastShift || !isShowShift(lastShift)) && (
        <div className={styles.wrapper__button}>
          <AddButton label="Создать смену" actionType="shift" />
        </div>
      )}

      {currentShiftId && lastShift && isShowShift(lastShift) && (
        <>
          <ShiftInfo
            date={lastShift.date}
            shiftNumber={lastShift.shiftNumber}
            teamNumber={lastShift.teamNumber}
          />
          <TeamProfessionList
            list={usersShifts}
            teamNumber={lastShift.teamNumber}
          />
          <UserShiftList shiftId={currentShiftId} />
        </>
      )}
    </MainLayout>
  );
};
