import styles from './search.module.css';

interface IIconProps {
  width?: number | string;
  height?: number | string;
}

export const SearchIcon = ({ width = 20, height = 20 }: IIconProps) => {
  return (
    <svg
      className={styles.icon}
      width={width}
      height={height}
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.796 15.811 21 21m-3-10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0'
      />
    </svg>
  );
};
