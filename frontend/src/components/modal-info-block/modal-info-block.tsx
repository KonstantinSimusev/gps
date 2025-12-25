import styles from './modal-info-block.module.css';

import { useContext } from 'react';

import { Button } from '../ui/button/button';

import { LayerContext } from '../../contexts/layer/layerContext';

export const ModalInfoBlock = () => {
  const { selectedUser, setIsOpenOverlay, setIsUserShiftInfoOpenModal } =
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
            {selectedUser?.lastName} {selectedUser?.firstName}
          </span>
          <span className={styles.text}>{selectedUser?.patronymic}</span>
        </div>
        <span className={styles.text}>
          из бригады №{selectedUser?.currentTeamNumber}
        </span>

        <span className={styles.text}>добавлен в категорию:</span>
        <span className={styles.text}>{selectedUser?.profession}</span>
      </div>
      <div className={styles.wrapper__button}>
        <Button label='Понятно' onClick={handleClick} />
      </div>
    </div>
  );
};
