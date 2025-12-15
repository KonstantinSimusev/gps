// import styles from './production.module.css';

import { useEffect } from 'react';

import { Layout } from '../../ui/layout/layout';
import { PageTitle } from '../../ui/page-title/page-title';
import { ShiftInfo } from '../../shift-info/shift-info';

import { useDispatch, useSelector } from '../../../services/store';
import {
  selectCurrentShift,
  selectCurrentShiftId,
} from '../../../services/slices/shift/slice';
import { getLastTeamShift } from '../../../services/slices/shift/actions';
import { Error } from '../../ui/error/error';
import { ProductionList } from '../../lists/production-list/production-list';
import { isShowShift } from '../../../utils/utils';

export const Production = () => {
  const dispatch = useDispatch();
  const lastShift = useSelector(selectCurrentShift);
  const currentShiftId = useSelector(selectCurrentShiftId);

  useEffect(() => {
    dispatch(getLastTeamShift());
  }, []);

  return (
    <Layout>
      <PageTitle title="ПРОИЗВОДСТВО" />
      {currentShiftId && lastShift && isShowShift(lastShift) ? (
        <>
          <ShiftInfo
            date={lastShift.date}
            shiftNumber={lastShift.shiftNumber}
            teamNumber={lastShift.teamNumber}
          />
          <ProductionList shiftId={currentShiftId} />
        </>
      ) : (
        <Error />
      )}
    </Layout>
  );
};
