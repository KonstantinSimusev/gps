import { useContext } from 'react';
import clsx from 'clsx';

import { LayerContext } from '../../../../contexts/layer/layerContext';
import { CloseIcon } from '../../icons/close/close';

import styles from './close-button.module.css';

interface IProps {
  className?: string;
}

export const CloseButton = ({ className }: IProps) => {
  const {
    isAccountInfoOpen,

    setIsOverlayOpen,
    setIsMenuOpen,
    setIsLoginOpen,
    setIsLogoutOpen,
    setIsEmployeeSearchOpen,
    setIsEmployeeCreateOpen,
    setIsEmployeeEditOpen,
    setIsPasswordUpdateOpen,
    setIsShiftSearchOpen,
    setIsEmployeeAddOpen,
    setIsEmployeeShiftEditOpen,
    setIsEmployeeShiftDeleteOpen,
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
    setIsPasswordUpdateOpen(false);
    setIsShiftSearchOpen(false);
    setIsEmployeeAddOpen(false);
    setIsEmployeeShiftEditOpen(false);
    setIsEmployeeShiftDeleteOpen(false);
  };

  return (
    <button
      type='button'
      className={clsx(styles.container, className)}
      onClick={handleClick}
    >
      <CloseIcon />
    </button>
  );
};
