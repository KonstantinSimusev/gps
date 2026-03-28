import { useContext } from 'react';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { DeleteIcon } from '../../ui/icons/delete/delete';

import styles from './delete.module.css';

interface IDeleteButtonProps {
  id: string;
  actionType: 'employee';
  label?: string;
  iconWidth?: number | string;
  iconHeight?: number | string;
}

export const DeleteButton = ({
  id,
  label,
  iconWidth,
  iconHeight,
  actionType,
}: IDeleteButtonProps) => {
  const { setIsOverlayOpen, setIsEmployeeDeleteOpen, setSelectedId } =
    useContext(LayerContext);

  const handleClick = () => {
    switch (actionType) {
      case 'employee':
        setSelectedId(id);
        setIsOverlayOpen(true);
        setIsEmployeeDeleteOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <button className={styles.container} type='button' onClick={handleClick}>
      {label}
      <DeleteIcon width={iconWidth} height={iconHeight} />
    </button>
  );
};
