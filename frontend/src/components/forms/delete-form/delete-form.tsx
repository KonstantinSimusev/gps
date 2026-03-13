import { useContext } from 'react';
// import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

// import {
//   deleteUserShift,
//   getUsersShifts,
// } from '../../../services/slices/user-shift/actions';

// import { selectIsLoadingUserShift } from '../../../services/slices/user-shift/slice';
// import { selectLastShift } from '../../../services/slices/shift/slice';

import { Form } from '../../ui/form/form';
// import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './delete-form.module.css';

export const DeleteForm = () => {
  const {
    // selectedId,
    selectedButtonActionType,
    setIsOpenOverlay,
    setIsDeleteOpenModall,
  } = useContext(LayerContext);

  // const dispatch = useDispatch();
  // const lastShift = useSelector(selectLastShift);
  // const isLoading = useSelector(selectIsLoadingUserShift);

  // if (!lastShift) {
  //   console.error('Не удалось получить смену');
  //   return;
  // }

  const handleClickDelete = async () => {
    try {
      if (selectedButtonActionType === 'userShift') {
        // await dispatch(deleteUserShift(selectedId));
        // await dispatch(getUsersShifts(lastShift.id));
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
    <Form title='Удалить работника?' titleClassName={styles.title}>
      {/* <Spinner isLoading={isLoading} className={styles.spinner} /> */}

      <div className={styles.buttons__wrapper}>
        <Button
          type='button'
          label='Да'
          onClick={handleClickDelete}
          className={styles.button__logout}
        />

        <Button
          type='button'
          label='Отменить'
          onClick={handleClickReturn}
          className={styles.button__return}
        />
      </div>
    </Form>
  );
};
