import { useContext } from 'react';

// import { useDispatch, useSelector } from '../../../services/store';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { Form } from '../../ui/form/form';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './employee-delete-form.module.css';

export const EmployeeDeleteForm = () => {
  const { setIsOverlayOpen, setIsEmployeeDeleteOpen } =
  useContext(LayerContext);

  // const dispatch = useDispatch();
  const isLoading = true;

  const handleDeleteClick = async () => {
    try {
      // Диспачим действие выхода
      // await dispatch(logoutEmployee());

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
      <Spinner isLoading={isLoading} className={styles.spinner} />

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
