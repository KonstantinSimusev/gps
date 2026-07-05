import { useContext, useEffect } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import { updateLoginAndPassword } from '../../../services/slices/account/actions';

import {
  clearUpdateAccountError,
  selectIsUpdateAccountLoading,
  selectUpdateAccountError,
} from '../../../services/slices/account/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { ServerError } from '../../ui/server-error/server-error';
import { Spinner } from '../../ui/spinner/spinner';

import styles from './password-update-form.module.css';

export const PasswordUpdateForm = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsUpdateAccountLoading);
  const serverError = useSelector(selectUpdateAccountError);

  const {
    selectedId,
    isPasswordUpdateOpen,
    setIsOverlayOpen,
    setIsPasswordUpdateOpen,
    setIsAccountInfoOpen,
  } = useContext(LayerContext);

  useEffect(() => {
    if (isPasswordUpdateOpen) {
      dispatch(clearUpdateAccountError());
    }
  }, [isPasswordUpdateOpen]);

  const handleUpdateClick = async () => {
    const result = await dispatch(updateLoginAndPassword(selectedId));

    // Очищаем состояние оверлеев и модальных окон
    if (result.payload) {
      setIsPasswordUpdateOpen(false);
      setIsAccountInfoOpen(true);
    }
  };

  const handleReturnClick = () => {
    setIsOverlayOpen(false);
    setIsPasswordUpdateOpen(false);
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading;

  return (
    <Form title='Обновить логин и пароль?' className={styles.title}>
      <div className={styles.message}>
        {isLoading ? <Spinner /> : <ServerError text={serverError} />}
      </div>

      <div className={styles.buttons__wrapper}>
        <Button
          type='button'
          disabled={isButtonDisabled}
          onClick={handleUpdateClick}
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
