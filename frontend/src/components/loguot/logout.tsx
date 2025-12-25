import styles from './logout.module.css';

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { LayerContext } from '../../contexts/layer/layerContext';
import { useDispatch, useSelector } from '../../services/store';
import { logoutUser } from '../../services/slices/auth/actions';
import { resetShift } from '../../services/slices/shift/slice';
import { Spinner } from '../spinner/spinner';
import { selectIsLoading } from '../../services/slices/auth/slice';

export const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsOpenOverlay, setIsLogoutOpenModal } = useContext(LayerContext);
  const isLoading = useSelector(selectIsLoading);

  const handleClickLogout = async () => {
    try {
      // Диспачим действие выхода
      await dispatch(logoutUser());

      // Отчищаем смены
      dispatch(resetShift());

      // Очищаем состояние оверлеев и модальных окон
      setIsOpenOverlay(false);
      setIsLogoutOpenModal(false);

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
    <div className={styles.container}>
      <span className={styles.text}>Хотите&nbsp;выйти?</span>

      <div className={styles.spinner}>{isLoading && <Spinner />}</div>

      <div className={styles.wrapper}>
        <button
          className={styles.button__logout}
          type='button'
          onClick={handleClickLogout}
        >
          Да
        </button>
        <button
          className={styles.button__return}
          type='button'
          onClick={handleClickReturn}
        >
          Отменить
        </button>
      </div>
    </div>
  );
};
