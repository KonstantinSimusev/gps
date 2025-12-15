import styles from './modal-info-block.module.css';

import { useSelector } from 'react-redux';
import { selectCurrentUserShift } from '../../services/slices/user-shift/slice';
import { Button } from '../ui/button/button';
import { useContext } from 'react';
import { LayerContext } from '../../contexts/layer/layerContext';

export const ModalInfoBlock = () => {
  const currentUserShift = useSelector(selectCurrentUserShift);
  const { setIsOpenOverlay, setIsUserShiftInfoOpenModal } =
    useContext(LayerContext);

  const handleClick = () => {
    setIsUserShiftInfoOpenModal(false);
    setIsOpenOverlay(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.wrapper__fio}>
          <span className={styles.text}>
            {currentUserShift?.user?.lastName}{' '}
            {currentUserShift?.user?.firstName}
          </span>
          <span className={styles.text}>
            {currentUserShift?.user?.patronymic}
          </span>
        </div>
        <span className={styles.text}>
          из бригады №{currentUserShift?.user?.currentTeamNumber}
        </span>

        <span className={styles.text}>добавлен в категорию:</span>
        <span className={styles.text}>{currentUserShift?.shiftProfession}</span>
      </div>
      <div className={styles.wrapper__button}>
        <Button label={'Понятно'} onClick={handleClick} />
      </div>
    </div>
  );
};
