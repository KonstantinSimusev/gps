import { useContext } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { useDispatch, useSelector } from '../../../services/store';

import { deleteEmployee } from '../../../services/slices/employee/actions';

import {
  selectDeleteEmployeeError,
  selectIsDeleteEmployeeLoading,
} from '../../../services/slices/employee/slice';

import { Form } from '../../ui/form/form';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './employee-delete-form.module.css';

export const EmployeeDeleteForm = () => {
  const { selectedId, setIsOverlayOpen, setIsEmployeeDeleteOpen } =
    useContext(LayerContext);

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsDeleteEmployeeLoading);
  const serverError = useSelector(selectDeleteEmployeeError);

  const handleDeleteClick = async () => {
    try {
      await dispatch(deleteEmployee(selectedId));

      // Очищаем состояние оверлеев и модальных окон
      setIsOverlayOpen(false);
      setIsEmployeeDeleteOpen(false);
    } catch (error) {
      setIsOverlayOpen(false);
      setIsEmployeeDeleteOpen(false);
    }
  };

  const handleReturnClick = () => {
    setIsOverlayOpen(false);
    setIsEmployeeDeleteOpen(false);
  };

  return (
    <Form title='Удалить работника?' titleClassName={styles.title}>
      <span className={styles.info}>
        При удалении данные станут недоступны для отчётности. Вместо удаления
        укажите дату увольнения в профиле: так данные останутся доступны для
        отчётности.
      </span>

      <Spinner
        isLoading={isLoading}
        serverError={serverError}
        className={styles.spinner}
      />

      <div className={styles.buttons__wrapper}>
        <Button
          type='button'
          label='Да'
          onClick={handleDeleteClick}
          className={styles.button__ok}
        />

        <Button
          type='button'
          label='Отменить'
          onClick={handleReturnClick}
          className={styles.button__return}
        />
      </div>
    </Form>
  );
};
