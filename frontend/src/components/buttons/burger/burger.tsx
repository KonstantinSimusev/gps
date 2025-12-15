import styles from './burger.module.css';

import { useContext } from 'react';
import { BurgerIcon } from '../../icons/burger/burger';
import { LayerContext } from '../../../contexts/layer/layerContext';

export const BurgerButton = () => {
  const { setIsOpenMenu, setIsOpenOverlay } = useContext(LayerContext);

  const handleClick = () => {
    setIsOpenMenu(true);
    setIsOpenOverlay(true);
  };
  return (
    <button className={styles.container} type="button" onClick={handleClick}>
      <BurgerIcon />
    </button>
  );
};
