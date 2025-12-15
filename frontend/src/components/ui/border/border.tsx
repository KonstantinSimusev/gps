import clsx from 'clsx';
import styles from './border.module.css';

interface IBorderProps {
  className?: string;
}

export const Border = ({ className }: IBorderProps) => {
  return <span className={clsx(styles.container, className)}></span>;
};
