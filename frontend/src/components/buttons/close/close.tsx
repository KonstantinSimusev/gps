import styles from './close.module.css';

import { useContext } from 'react';
import { CloseIcon } from '../../icons/close/close';
import { LayerContext } from '../../../contexts/layer/layerContext';

export const CloseButton = () => {
  const {
    setIsOpenMenu,
    setIsOpenOverlay,
    setIsLoginModalOpen,
    setIsLogoutOpenModal,
    setIsAddWorkerOpenModall,
    setIsUpdateWorkerOpenModall,
    setIsAddShiftOpenModall,
    setIsDeleteOpenModall,
    setIsUserShiftInfoOpenModal,
    setIsProductionOpenMdal,
    setIsShipmentOpenMdal,
    setIsPackOpenMdal,
    setIsFixOpenMdal,
    setIsResidueOpenMdal,
  } = useContext(LayerContext);

  const handleClick = () => {
    setIsOpenMenu(false);
    setIsOpenOverlay(false);
    setIsLoginModalOpen(false);
    setIsLogoutOpenModal(false);
    setIsAddWorkerOpenModall(false);
    setIsUpdateWorkerOpenModall(false);
    setIsAddShiftOpenModall(false);
    setIsDeleteOpenModall(false);
    setIsUserShiftInfoOpenModal(false);
    setIsProductionOpenMdal(false);
    setIsShipmentOpenMdal(false);
    setIsPackOpenMdal(false);
    setIsFixOpenMdal(false);
    setIsResidueOpenMdal(false);
  };

  return (
    <button className={styles.container} type="button" onClick={handleClick}>
      <CloseIcon />
    </button>
  );
};
