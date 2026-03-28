import { useContext } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { BurgerIcon } from '../../ui/icons/burger/burger';

import styles from './burger.module.css';

export const BurgerButton = () => {
  const { setIsOverlayOpen, setIsMenuOpen } = useContext(LayerContext);

  const handleClick = () => {
    setIsMenuOpen(true);
    setIsOverlayOpen(true);
  };
  return (
    <button className={styles.container} type='button' onClick={handleClick}>
      <BurgerIcon />
    </button>
  );
};
