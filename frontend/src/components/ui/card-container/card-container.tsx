import clsx from 'clsx';
import styles from './card-container.module.css';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CardContainer = ({ children, className, ...props }: IProps) => {
  return (
    <div className={clsx(styles.container, className)} {...props}>
      {children}
    </div>
  );
};
