import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../services/store';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { logoutEmployee } from '../../../services/slices/auth/actions';
import { selectIsAuthLoading } from '../../../services/slices/auth/slice';

import { Form } from '../../ui/form/form';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './logout-form.module.css';

export const LogoutForm = () => {
  const { setIsAgreed, setIsOverlayOpen, setIsLogoutOpen } =
    useContext(LayerContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsAuthLoading);

  const handleLogoutClick = async () => {
    try {
      // Диспачим действие выхода
      await dispatch(logoutEmployee());

      // Очищаем состояние оверлеев и модальных окон
      setIsOverlayOpen(false);
      setIsLogoutOpen(false);
      setIsAgreed(false);

      // После успешного выхода перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      setIsOverlayOpen(false);
      setIsLogoutOpen(false);
      navigate('/');
    }
  };

  const handleReturnClick = () => {
    setIsOverlayOpen(false);
    setIsLogoutOpen(false);
  };

  return (
    <Form title='Хотите выйти?' titleClassName={styles.title}>
      <Spinner isLoading={isLoading} className={styles.spinner} />

      <div className={styles.buttons__wrapper}>
        <Button
          type='button'
          onClick={handleLogoutClick}
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
