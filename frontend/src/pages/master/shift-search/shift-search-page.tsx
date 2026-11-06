import { useContext, useEffect } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch, useSelector } from '../../../services/store';
import { getShiftsByDate } from '../../../services/slices/shift/actions';

import { selectSearchShifts } from '../../../services/slices/shift/slice';

import { ShiftList } from '../../../components/lists/shift-list/shift-list';

import styles from './shift-search-page.module.css';

export const ShiftSearchPage = () => {
  const { selectedDate } = useContext(LayerContext);

  const dispatch = useDispatch();
  const shifts = useSelector(selectSearchShifts);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (selectedDate) {
      dispatch(getShiftsByDate({ shiftDate: selectedDate }));
    }
  }, [selectedDate]);

  return (
    <>
      {!shifts ? (
        <div className={styles.empty}>
          <span>Нажмите поиск в шапке,</span>
          <span>чтобы найти смену.</span>
        </div>
      ) : (
        <ShiftList shifts={shifts} />
      )}
    </>
  );
};
