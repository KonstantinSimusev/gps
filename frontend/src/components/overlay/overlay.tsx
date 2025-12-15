import styles from './overlay.module.css';

import { useContext } from 'react';
import { LayerContext } from '../../contexts/layer/layerContext';
import { useEscapeHandler } from '../../hooks/useEscapeHandler';
export const Overlay = () => {
  const {
    isOpenOverlay,
    isOpenMenu,
    isLoginModalOpen,
    isLogoutOpenModal,
    isAddWorkerOpenModall,
    isUpdateWorkerOpenModall,
    isAddShiftOpenModall,
    isDeleteOpenModall,
    isUserShiftInfoOpenModal,
    isProductionOpenMdal,
    isShipmentOpenMdal,
    isPackOpenMdal,
    isFixOpenMdal,
    isResidueOpenMdal,
    setIsOpenOverlay,
    setIsOpenMenu,
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

  useEscapeHandler(() => {
    if (isOpenOverlay) {
      setIsOpenOverlay(false);
    }

    if (isOpenMenu) {
      setIsOpenMenu(false);
    }

    if (isLoginModalOpen) {
      setIsLoginModalOpen(false);
    }

    if (isLogoutOpenModal) {
      setIsLogoutOpenModal(false);
    }

    if (isAddWorkerOpenModall) {
      setIsAddWorkerOpenModall(false);
    }

    if (isUpdateWorkerOpenModall) {
      setIsUpdateWorkerOpenModall(false);
    }

    if (isAddShiftOpenModall) {
      setIsAddShiftOpenModall(false);
    }

    if (isDeleteOpenModall) {
      setIsDeleteOpenModall(false);
    }

    if (isUserShiftInfoOpenModal) {
      setIsUserShiftInfoOpenModal(false);
    }

    if (isProductionOpenMdal) {
      setIsProductionOpenMdal(false);
    }

    if (isShipmentOpenMdal) {
      setIsShipmentOpenMdal(false);
    }

    if (isPackOpenMdal) {
      setIsPackOpenMdal(false);
    }

    if (isFixOpenMdal) {
      setIsFixOpenMdal(false);
    }

    if (isResidueOpenMdal) {
      setIsResidueOpenMdal(false);
    }
  });

  const handleClick = (event: React.MouseEvent) => {
    // Проверяем, был ли клик по самому оверлею
    if (event.target === event.currentTarget) {
      setIsOpenOverlay(false);
      setIsOpenMenu(false);
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
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClick} tabIndex={-1}></div>
  );
};
