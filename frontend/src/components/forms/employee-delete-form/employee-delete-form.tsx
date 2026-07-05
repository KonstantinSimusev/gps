import { useContext, useEffect } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import { deleteEmployee } from '../../../services/slices/employee/actions';

import {
  clearDeleteEmployeeError,
  selectDeleteEmployeeError,
  selectIsDeleteEmployeeLoading,
} from '../../../services/slices/employee/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { Spinner } from '../../ui/spinner/spinner';

import styles from './employee-delete-form.module.css';
import { ServerError } from '../../ui/server-error/server-error';

export const EmployeeDeleteForm = () => {
  const {
    selectedId,
    isEmployeeDeleteOpen,
    setIsOverlayOpen,
    setIsEmployeeDeleteOpen,
  } = useContext(LayerContext);

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsDeleteEmployeeLoading);
  const serverError = useSelector(selectDeleteEmployeeError);

  useEffect(() => {
    if (isEmployeeDeleteOpen) {
      dispatch(clearDeleteEmployeeError());
    }
  }, [isEmployeeDeleteOpen]);

  const handleDeleteClick = async () => {
    const result = await dispatch(deleteEmployee(selectedId));

    // Очищаем состояние оверлеев и модальных окон
    if (result.payload) {
      setIsOverlayOpen(false);
      setIsEmployeeDeleteOpen(false);
    }
  };

  const handleReturnClick = () => {
    setIsOverlayOpen(false);
    setIsEmployeeDeleteOpen(false);
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading;

  return (
    <Form title='Удалить работника?' className={styles.title}>
      <span className={styles.info}>
        При удалении данные станут недоступны для отчётности. Вместо удаления
        укажите дату увольнения в профиле: так данные останутся доступны для
        отчётности.
      </span>

      <div className={styles.message}>
        {isLoading ? <Spinner /> : <ServerError text={serverError} />}
      </div>

      <div className={styles.buttons__wrapper}>
        <Button
          type='button'
          disabled={isButtonDisabled}
          onClick={handleDeleteClick}
          className={styles.button__ok}
        >
          Да
        </Button>

        <Button
          type='button'
          onClick={handleReturnClick}
          className={styles.button__return}
        >
          Отменить
        </Button>
      </div>
    </Form>
  );
};
