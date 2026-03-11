import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../services/store';

import { logoutEmployee } from '../../../services/slices/auth/actions';
import { selectIsLoading } from '../../../services/slices/auth/slice';
import { resetShift } from '../../../services/slices/shift/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Form } from '../../ui/form/form';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './logout-form.module.css';

export const LogoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsAgreed, setIsOpenOverlay, setIsLogoutOpenModal } =
    useContext(LayerContext);
  const isLoading = useSelector(selectIsLoading);

  const handleClickLogout = async () => {
    try {
      // Диспачим действие выхода
      await dispatch(logoutEmployee());

      // Отчищаем смены
      dispatch(resetShift());

      // Очищаем состояние оверлеев и модальных окон
      setIsOpenOverlay(false);
      setIsLogoutOpenModal(false);
      setIsAgreed(false);

      // После успешного выхода перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      setIsOpenOverlay(false);
      setIsLogoutOpenModal(false);
      navigate('/');
    }
  };

  const handleClickReturn = () => {
    setIsLogoutOpenModal(false);
    setIsOpenOverlay(false);
  };

  return (
    <Form title='Хотите выйти?' titleClassName={styles.title}>
      <Spinner isLoading={isLoading} className={styles.spinner} />

      <div className={styles.buttons__wrapper}>
        <Button
          type='button'
          label='Да'
          onClick={handleClickLogout}
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
