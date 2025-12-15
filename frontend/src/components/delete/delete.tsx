import styles from './delete.module.css';

import { useContext } from 'react';

import { LayerContext } from '../../contexts/layer/layerContext';
import { useDispatch, useSelector } from '../../services/store';

import { Spinner } from '../spinner/spinner';
import {
  selectCurrentShiftId,
  selectIsLoadingShift,
} from '../../services/slices/shift/slice';
import { selectIsLoadingUserShift } from '../../services/slices/user-shift/slice';
import {
  deleteUserShift,
  getUsersShifts,
} from '../../services/slices/user-shift/actions';

export const Delete = () => {
  const dispatch = useDispatch();
  const currentShiftId = useSelector(selectCurrentShiftId);
  const isLoadingShift = useSelector(selectIsLoadingUserShift);
  const isLoadingUserShift = useSelector(selectIsLoadingShift);
  const {
    selectedId,
    selectedButtonActionType,
    setIsOpenOverlay,
    setIsDeleteOpenModall,
  } = useContext(LayerContext);

  const handleClickDelete = async () => {
    try {
      if (selectedButtonActionType === 'userShift') {
        await dispatch(deleteUserShift(selectedId));

        if (!currentShiftId) {
          return null;
        }

        await dispatch(getUsersShifts(currentShiftId));
      }

      // Очищаем состояние оверлеев и модальных окон
      setIsDeleteOpenModall(false);
      setIsOpenOverlay(false);
    } catch (error) {
      setIsDeleteOpenModall(false);
      setIsOpenOverlay(false);
    }
  };

  const handleClickReturn = () => {
    setIsDeleteOpenModall(false);
    setIsOpenOverlay(false);
  };

  return (
    <div className={styles.container}>
      <span className={styles.wrapper__info}>
        <span className={styles.text}>Удалить смену?</span>
      </span>
      <div className={styles.spinner}>
        {isLoadingShift && <Spinner />}
        {isLoadingUserShift && <Spinner />}
      </div>

      <div className={styles.wrapper}>
        <button
          className={styles.button__logout}
          type="button"
          onClick={handleClickDelete}
        >
          Удалить
        </button>
        <button
          className={styles.button__return}
          type="button"
          onClick={handleClickReturn}
        >
          Отменить
        </button>
      </div>
    </div>
  );
};
