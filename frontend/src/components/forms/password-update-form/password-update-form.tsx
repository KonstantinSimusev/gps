import { useContext } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { useDispatch, useSelector } from '../../../services/store';

import { Form } from '../../ui/form/form';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import { updateLoginAndPassword } from '../../../services/slices/account/actions';
import {
  selectIsUpdateAccountLoading,
  selectUpdateAccountError,
} from '../../../services/slices/account/slice';

import styles from './password-update-form.module.css';

export const PasswordUpdateForm = () => {
  const {
    selectedId,
    setIsOverlayOpen,
    setIsPasswordUpdateOpen,
    setIsAccountInfoOpen,
  } = useContext(LayerContext);

  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsUpdateAccountLoading);
  const serverError = useSelector(selectUpdateAccountError);

  const handleUpdateClick = async () => {
    await dispatch(updateLoginAndPassword(selectedId));

    // Очищаем состояние оверлеев и модальных окон
    setIsOverlayOpen(false);
    setIsPasswordUpdateOpen(false);
    setIsAccountInfoOpen(true);
  };

  const handleReturnClick = () => {
    setIsOverlayOpen(false);
    setIsPasswordUpdateOpen(false);
  };

  return (
    <Form title='Обновить логин и пароль?' titleClassName={styles.title}>
      <Spinner
        isLoading={isLoading}
        serverError={serverError}
        className={styles.spinner}
      />

      <div className={styles.buttons__wrapper}>
        <Button
          type='button'
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
