import styles from './burger.module.css';

interface IIconProps {
  width?: number | string;
  height?: number | string;
}

export const BurgerIcon = ({ width = 30, height = 30 }: IIconProps) => {
  return (
    <svg
      className={styles.icon}
      width={width}
      height={height}
      viewBox='0 0 24 24'
    >
      <path d='M4 18h16M4 12h16M4 6h16' />
    </svg>
  );
};
