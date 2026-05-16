import clsx from 'clsx';

import styles from './add.module.css';

interface IProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const AddIcon = ({ width = 20, height = 20, className }: IProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      className={clsx(styles.icon, className)}
    >
      <path strokeLinecap='round' d='M4 12h16m-8-8v16' />
    </svg>
  );
};
