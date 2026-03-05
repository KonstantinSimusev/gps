import clsx from 'clsx';
import styles from './spinner.module.css';
import { ServerError } from '../errors/server-error/server-error';

interface IProps {
  className?: string;
  isLoading?: boolean;
  serverError?: string | null;
}

export const Spinner = ({ className, isLoading, serverError }: IProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      {isLoading ? (
        <span className={styles.spinner}></span>
      ) : (
        <ServerError text={serverError} />
      )}
    </div>
  );
};
