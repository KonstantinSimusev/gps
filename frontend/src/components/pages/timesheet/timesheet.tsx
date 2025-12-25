import styles from './timesheet.module.css';

import { useEffect } from 'react';

import { MainLayout } from '../../ui/layouts/main/main-layout';
import { Loader } from '../../ui/loader/loader';
import { PageTitle } from '../../ui/page-title/page-title';
import { AddButton } from '../../buttons/add/add-button';
import { TeamProfessionList } from '../../lists/profession-list/profession-list';
import { HeaderWrapper } from '../../ui/wrappers/header-wrapper/header-wrapper';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { UserShiftList } from '../../lists/user-shift-list/user-shift-list';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectIsLoadingLastShift,
  selectLastShift,
} from '../../../services/slices/shift/slice';

import { getLastTeamShift } from '../../../services/slices/shift/actions';

export const Timesheet = () => {
  const dispatch = useDispatch();

  const lastShift = useSelector(selectLastShift);
  const isLoading = useSelector(selectIsLoadingLastShift);

  useEffect(() => {
    dispatch(getLastTeamShift());
  }, []);

  if (isLoading && !lastShift) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (lastShift === null) {
    return (
      <MainLayout>
        <PageTitle title="ТАБЕЛЬ" />
        <div className={styles.wrapper__button}>
          <AddButton label="Создать смену" actionType="shift" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeaderWrapper gap={10}>
        <PageTitle title="ТАБЕЛЬ" />
        <ShiftDate
          date={lastShift.date}
          shiftNumber={lastShift.shiftNumber}
          teamNumber={lastShift.teamNumber}
        />
      </HeaderWrapper>

      {lastShift.usersShifts && (
        <TeamProfessionList
          list={lastShift.usersShifts}
          teamNumber={lastShift.teamNumber}
        />
      )}

      {lastShift.usersShifts && (
        <UserShiftList shift={lastShift} list={lastShift.usersShifts} />
      )}
    </MainLayout>
  );
};
