import clsx from 'clsx';

import styles from './back.module.css';

interface IProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const BackIcon = ({ width = 20, height = 20, className }: IProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 1024 1024'
      className={clsx(styles.icon, className)}
    >
      <path d='M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-.8 88.8z' />
    </svg>
  );
};
