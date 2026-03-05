import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../services/store';

import { getLastShift } from '../../../services/slices/shift/actions';

import {
  selectIsLoadingLastShift,
  selectLastShift,
  selectLastShiftError,
} from '../../../services/slices/shift/slice';

import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
import { Loader } from '../../../components/ui/loader/loader';
import { Error } from '../../../components/ui/errors/error/error';
import { ShiftDate } from '../../../components/ui/shift-date/shift-date';

export const Production = () => {
  const dispatch = useDispatch();

  const lastShift = useSelector(selectLastShift);
  const isLoadingLastShift = useSelector(selectIsLoadingLastShift);
  const lastShiftError = useSelector(selectLastShiftError);

  useEffect(() => {
    dispatch(getLastShift());
  }, []);

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
        <Error text={lastShiftError ?? 'Что-то пошло не так'} />
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

      {/* {lastShift.productions && <ProductionList list={lastShift.productions} />} */}
    </MainLayout>
  );
};
