import { useContext } from 'react';
import { LayerContext } from '../../../contexts/layer/layerContext';
import { CloseIcon } from '../../ui/icons/close/close';

import styles from './close.module.css';

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
  };

  return (
    <button className={styles.container} type='button' onClick={handleClick}>
      <CloseIcon />
    </button>
  );
};
