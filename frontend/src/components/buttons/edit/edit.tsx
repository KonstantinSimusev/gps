import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { EditIcon } from '../../ui/icons/edit/edit';

import styles from './edit.module.css';

interface IEditButtonProps {
  id?: string;
  label?: string;
  iconWidth?: number | string;
  iconHeight?: number | string;
  actionType:
    | 'home'
    | 'timesheet'
    | 'production'
    | 'shipment'
    | 'pack'
    | 'fix'
    | 'worker';
}

export const EditButton = ({
  id,
  label,
  iconWidth,
  iconHeight,
  actionType,
}: IEditButtonProps) => {
  if (!id) {
    return null;
  }

  const navigate = useNavigate();
  const {
    setIsOpenOverlay,
    setIsUpdateWorkerOpenModall,
    setIsProductionOpenMdal,
    setIsShipmentOpenMdal,
    setIsPackOpenMdal,
    setIsFixOpenMdal,
    setSelectedId,
  } = useContext(LayerContext);

  const handleClick = () => {
    switch (actionType) {
      case 'timesheet':
        navigate(`/timesheet/shifts/${id}`);
        window.scrollTo(0, 0);
        break;
      case 'production':
        setIsOpenOverlay(true);
        setIsProductionOpenMdal(true);
        setSelectedId(id);
        break;
      case 'shipment':
        setIsOpenOverlay(true);
        setIsShipmentOpenMdal(true);
        setSelectedId(id);
        break;
      case 'pack':
        setIsOpenOverlay(true);
        setIsPackOpenMdal(true);
        setSelectedId(id);
        break;
      case 'fix':
        setIsOpenOverlay(true);
        setIsFixOpenMdal(true);
        setSelectedId(id);
        break;
      case 'worker':
        setIsOpenOverlay(true);
        setIsUpdateWorkerOpenModall(true);
        setSelectedId(id);
        break;
      default:
        console.warn(`Неизвестный actionType: ${actionType}`, { id });
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
