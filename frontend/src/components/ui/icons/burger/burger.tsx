import styles from './burger.module.css';

export const BurgerIcon = () => {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24">
      <path d="M4 18h16M4 12h16M4 6h16" />
    </svg>
  );
};
