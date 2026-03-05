import { useContext } from 'react';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { DeleteIcon } from '../../ui/icons/delete/delete';

import styles from './delete.module.css';

interface IDeleteButtonProps {
  id?: string;
  label?: string;
  iconWidth?: number | string;
  iconHeight?: number | string;
  actionType: 'shift' | 'userShift';
}

export const DeleteButton = ({
  id,
  label,
  iconWidth,
  iconHeight,
  actionType,
}: IDeleteButtonProps) => {
  if (!id) {
    return null;
  }

  const {
    setIsOpenOverlay,
    setIsDeleteOpenModall,
    setSelectedId,
    setSelectedButtonActionType,
  } = useContext(LayerContext);

  const handleClick = () => {
    setIsOpenOverlay(true);
    setIsDeleteOpenModall(true);
    setSelectedId(id);
    setSelectedButtonActionType(actionType);
  };

  return (
    <button className={styles.container} type="button" onClick={handleClick}>
      {label}
      <DeleteIcon width={iconWidth} height={iconHeight} />
    </button>
  );
};
