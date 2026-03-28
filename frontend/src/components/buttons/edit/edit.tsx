import { useContext } from 'react';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { EditIcon } from '../../ui/icons/edit/edit';

import styles from './edit.module.css';

interface IEditButtonProps {
  id: string;
  actionType: 'employee';
  label?: string;
  iconWidth?: number | string;
  iconHeight?: number | string;
}

export const EditButton = ({
  id,
  actionType,
  label,
  iconWidth,
  iconHeight,
}: IEditButtonProps) => {
  const { setIsOverlayOpen, setIsEmployeeEditOpen, setSelectedId } =
    useContext(LayerContext);

  const handleClick = () => {
    switch (actionType) {
      case 'employee':
        setSelectedId(id);
        setIsOverlayOpen(true);
        setIsEmployeeEditOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <button className={styles.container} type='button' onClick={handleClick}>
      {label}
      <EditIcon width={iconWidth} height={iconHeight} />
    </button>
  );
};
