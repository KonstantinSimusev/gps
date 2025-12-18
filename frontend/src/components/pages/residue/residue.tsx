// import styles from './residue.module.css';

import { useEffect } from 'react';

import { MainLayout } from '../../ui/layouts/main/main-layout';
import { PageTitle } from '../../ui/page-title/page-title';
import { ShiftInfo } from '../../shift-info/shift-info';
import { Error } from '../../ui/error/error';

import { useDispatch, useSelector } from '../../../services/store';
import {
  selectCurrentShift,
  selectCurrentShiftId,
} from '../../../services/slices/shift/slice';
import { getLastTeamShift } from '../../../services/slices/shift/actions';
import { isShowShift } from '../../../utils/utils';
import { ResidueList } from '../../lists/residue-list/residue-list';

export const Residue = () => {
  const dispatch = useDispatch();
  const lastShift = useSelector(selectCurrentShift);
  const currentShiftId = useSelector(selectCurrentShiftId);

  useEffect(() => {
    dispatch(getLastTeamShift());
  }, []);

  return (
    <MainLayout>
      <PageTitle title="ОСТАТКИ" />
      {currentShiftId && lastShift && isShowShift(lastShift) ? (
        <>
          <ShiftInfo
            date={lastShift.date}
            shiftNumber={lastShift.shiftNumber}
            teamNumber={lastShift.teamNumber}
          />
          <ResidueList shiftId={currentShiftId} />
        </>
      ) : (
        <Error />
      )}
    </MainLayout>
  );
};
