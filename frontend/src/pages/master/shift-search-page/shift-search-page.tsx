import { useContext, useEffect } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch, useSelector } from '../../../services/store';
import { getShiftsByDate } from '../../../services/slices/shift/actions';
import {
  selectIsSearchShiftsLoading,
  selectSearchShifts,
} from '../../../services/slices/shift/slice';

import { Loader } from '../../../components/ui/loader/loader';
import { MainLayout } from '../../../components/ui/layouts/main/main-layout';
import { ShiftList } from '../../../components/lists/shift-list/shift-list';

import styles from './shift-search-page.module.css';

export const ShiftSearchPage = () => {
  const { selectedDate } = useContext(LayerContext);
  const dispatch = useDispatch();
  const shifts = useSelector(selectSearchShifts);
  const isLoading = useSelector(selectIsSearchShiftsLoading);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (selectedDate) {
      dispatch(getShiftsByDate({ shiftDate: selectedDate }));
    }
  }, []);

  return (
    <MainLayout className={styles.container}>
      {isLoading ? (
        <Loader text='Загрузка' />
      ) : shifts === null || shifts.length === 0 || selectedDate === null ? (
        <p className={styles.empty}>Поиск смен</p>
      ) : (
        <ShiftList shifts={shifts} />
      )}
    </MainLayout>
  );
};
