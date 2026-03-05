import clsx from 'clsx';
import styles from './server-error.module.css';

interface IProps {
  text?: string | null;
  className?: string;
}

export const ServerError = ({ text, className }: IProps) => {
  return <span className={clsx(styles.container, className)}>{text}</span>;
};
