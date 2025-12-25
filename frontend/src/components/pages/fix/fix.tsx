// import styles from './fix.module.css';

import { useEffect } from 'react';

import { MainLayout } from '../../ui/layouts/main/main-layout';
import { Loader } from '../../ui/loader/loader';
import { PageTitle } from '../../ui/page-title/page-title';
import { Error } from '../../ui/error/error';
import { HeaderWrapper } from '../../ui/wrappers/header-wrapper/header-wrapper';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { FixList } from '../../lists/fix-list/fix-list';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectIsLoadingLastShift,
  selectLastShift,
} from '../../../services/slices/shift/slice';

import { getLastTeamShift } from '../../../services/slices/shift/actions';

export const Fix = () => {
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
        <PageTitle title="РАСКРЕПЛЕНИЕ" />
        <Error />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeaderWrapper gap={10}>
        <PageTitle title="РАСКРЕПЛЕНИЕ" />
        <ShiftDate
          date={lastShift.date}
          shiftNumber={lastShift.shiftNumber}
          teamNumber={lastShift.teamNumber}
        />
      </HeaderWrapper>

      {lastShift.fixs && <FixList list={lastShift.fixs} />}
    </MainLayout>
  );
};
