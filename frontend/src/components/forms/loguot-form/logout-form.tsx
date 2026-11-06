import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch } from '../../../services/store';

import { logoutEmployee } from '../../../services/slices/auth/actions';

import { clearAccountInfo } from '../../../services/slices/account/slice';

import {
  clearAuthError,
  clearChecking,
  clearIsAuthenticated,
  clearIsAuthLoading,
  clearIsRole,
  clearProfile,
} from '../../../services/slices/auth/slice';

import {
  clearEmployeeAccountInfo,
  clearEmployeeInfo,
} from '../../../services/slices/employee/slice';

import {
  clearNotice,
  clearNotices,
} from '../../../services/slices/notice/slice';

import {
  clearSearchShifts,
  clearShift,
  clearShifts,
} from '../../../services/slices/shift/slice';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';

import styles from './logout-form.module.css';

export const LogoutForm = () => {
  const { setIsAgreed, setIsOverlayOpen, setIsLogoutOpen } =
    useContext(LayerContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogoutClick = async () => {
    try {
      // Диспачим действие выхода
      await dispatch(logoutEmployee());

      // 1. Сбрасываем сессию и профиль
      dispatch(clearProfile());
      dispatch(clearIsAuthenticated());
      dispatch(clearIsRole());
      dispatch(clearIsAuthLoading());
      dispatch(clearChecking());
      dispatch(clearAuthError());

      // 2. Сбрасываем персональные данные, привязанные к профилю
      dispatch(clearAccountInfo());
      dispatch(clearEmployeeInfo());
      dispatch(clearEmployeeAccountInfo());
      dispatch(clearNotice());
      dispatch(clearNotices());
      dispatch(clearShift());
      dispatch(clearShifts());
      dispatch(clearSearchShifts());

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
    <Form title='Хотите выйти?' className={styles.title}>
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
