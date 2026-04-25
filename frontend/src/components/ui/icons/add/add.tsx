import styles from './add.module.css';

interface IIconProps {
  width?: number | string;
  height?: number | string;
}

export const AddIcon = ({ width = 20, height = 20 }: IIconProps) => {
  return (
    <svg
      className={styles.icon}
      width={width}
      height={height}
      viewBox='0 0 24 24'
    >
      <path strokeLinecap='round' d='M4 12h16m-8-8v16' />
    </svg>
  );
};
