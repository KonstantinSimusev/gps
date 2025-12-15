import styles from './back.module.css';

import { BackIcon } from '../../icons/back/back';

import { useNavigate } from 'react-router-dom';

interface IBackButtonProps {
  actionType: 'home' | 'timesheet' | 'production' | 'shipment' | 'pack' | 'fix';
}

export const BackButton = ({ actionType }: IBackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    switch (actionType) {
      case 'home':
        navigate('/home');
        break;
      case 'timesheet':
        navigate('/timesheet');
        break;
      default:
        console.warn(`Неизвестный actionType: ${actionType}`);
        break;
    }
  };

  return (
    <button className={styles.container} type="button" onClick={handleClick}>
      <BackIcon />
      <span className={styles.text}>Назад</span>
    </button>
  );
};
