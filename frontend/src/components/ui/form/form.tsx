import clsx from 'clsx';
import styles from './form.module.css';

interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Form = ({ children, title, className, ...rest }: IFormProps) => {
  return (
    <form className={clsx(styles.form, className)} {...rest}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </form>
  );
};
