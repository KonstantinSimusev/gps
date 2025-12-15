import styles from './close.module.css';

export const CloseIcon = () => {
  return (
    <svg className={styles.icon} viewBox="-0.5 0 25 25">
      <path d="m3 21.32 18-18M3 3.32l18 18" />
    </svg>
  );
};
