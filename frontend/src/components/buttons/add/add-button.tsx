import styles from './add-button.module.css';

import { useContext } from 'react';
import { LayerContext } from '../../../contexts/layer/layerContext';

interface IAddButtonProps {
  label?: string;
  actionType: 'worker' | 'shift' | 'area'; // можно добавить другие типы
  onOpen?: () => void; // кастомный обработчик
}

export const AddButton = ({ label, actionType, onOpen }: IAddButtonProps) => {
  const {
    setIsOpenOverlay,
    setIsAddWorkerOpenModall,
    setIsAddShiftOpenModall,
  } = useContext(LayerContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsOpenOverlay(true);

    switch (actionType) {
      case 'worker':
        setIsAddWorkerOpenModall(true);
        break;
      case 'shift':
        setIsAddShiftOpenModall(true);
        break;
      case 'area':
        // setIsAddShiftOpenModall(true);
        break;
      default:
        // кастомное действие
        onOpen?.();
    }
  };

  return (
    <button className={styles.container} type="button" onClick={handleClick}>
      {label}
      {/* <AddIcon /> */}
    </button>
  );
};
