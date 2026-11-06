import clsx from 'clsx';
import styles from './form.module.css';

interface IProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = ({ children, title, className, onSubmit }: IProps) => {
  return (
    <form className={clsx(styles.form, className)} onSubmit={onSubmit}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </form>
  );
};
