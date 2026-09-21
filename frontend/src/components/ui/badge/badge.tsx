import clsx from 'clsx';
import styles from './badge.module.css';

type BadgeColor = 'red' | 'green' | 'orange';

interface IBadgeProps {
  color: BadgeColor;
  size?: number;
  className?: string;
}

export const Badge = ({ color, size = 6, className }: IBadgeProps) => {
  const style = size
    ? { width: size, height: size, display: 'inline-block' }
    : { display: 'inline-block' };

  return (
    <div
      style={style}
      className={clsx(styles.badge, styles[`badge--${color}`], className)}
    />
  );
};
