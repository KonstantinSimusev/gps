import { useContext } from 'react';

import { LayerContext } from '../../../../contexts/layer/layerContext';
import { CloseIcon } from '../../icons/close/close';

import styles from './close-button.module.css';

export const CloseButton = () => {
  const {
    isAccountInfoOpen,

    setIsOverlayOpen,
    setIsMenuOpen,
    setIsLoginOpen,
    setIsLogoutOpen,
    setIsEmployeeSearchOpen,
    setIsEmployeeCreateOpen,
    setIsEmployeeEditOpen,
    setIsEmployeeDeleteOpen,
    setIsPasswordUpdateOpen,
    setIsShiftAddOpen,
    setIsEmployeeAddOpen,
    setIsTimesheetEditOpen,
  } = useContext(LayerContext);

  const handleClick = () => {
    if (isAccountInfoOpen) {
      return;
    }

    setIsOverlayOpen(false);
    setIsMenuOpen(false);
    setIsLoginOpen(false);
    setIsLogoutOpen(false);
    setIsEmployeeSearchOpen(false);
    setIsEmployeeCreateOpen(false);
    setIsEmployeeEditOpen(false);
    setIsEmployeeDeleteOpen(false);
    setIsPasswordUpdateOpen(false);
    setIsShiftAddOpen(false);
    setIsEmployeeAddOpen(false);
    setIsTimesheetEditOpen(false);
  };

  return (
    <button className={styles.container} type='button' onClick={handleClick}>
      <CloseIcon />
    </button>
  );
};
