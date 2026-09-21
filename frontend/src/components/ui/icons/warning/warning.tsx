import clsx from 'clsx';
import styles from './warning.module.css';

interface IProps {
  size?: number;
  className?: string;
}

export const WarningIcon = ({ className, size = 16 }: IProps) => {
  return (
    <svg
      className={clsx(styles.icon, className)}
      width={size}
      height={size}
      viewBox='0 0 24 24'
    >
      {/* Жёлтый треугольник (фон) */}
      <path
        d='M22.25 17.55 14.63 3.71a3 3 0 0 0-5.26 0L1.75 17.55A3 3 0 0 0 4.38 22h15.24a3 3 0 0 0 2.63-4.45Z'
        fill='#FFC107'
      />
      
      {/* Тёмный восклицательный знак */}
      <path
        d='M12 18a1 1 0 1 1 1-1 1 1 0 0 1-1 1 m1-5a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0Z'
        fill='#333'
      />
    </svg>
  );
};
