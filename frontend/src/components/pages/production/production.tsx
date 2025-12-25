import { useEffect } from 'react';

import { MainLayout } from '../../ui/layouts/main/main-layout';
import { Loader } from '../../ui/loader/loader';
import { PageTitle } from '../../ui/page-title/page-title';
import { Error } from '../../ui/error/error';
import { HeaderWrapper } from '../../ui/wrappers/header-wrapper/header-wrapper';
import { ShiftDate } from '../../ui/shift-date/shift-date';
import { ProductionList } from '../../lists/production-list/production-list';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectIsLoadingLastShift,
  selectLastShift,
} from '../../../services/slices/shift/slice';

import { getLastTeamShift } from '../../../services/slices/shift/actions';

export const Production = () => {
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
        <PageTitle title="ПРОИЗВОДСТВО" />
        <Error />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeaderWrapper gap={10}>
        <PageTitle title="ПРОИЗВОДСТВО" />
        <ShiftDate
          date={lastShift.date}
          shiftNumber={lastShift.shiftNumber}
          teamNumber={lastShift.teamNumber}
        />
      </HeaderWrapper>

      {lastShift.productions && <ProductionList list={lastShift.productions} />}
    </MainLayout>
  );
};
