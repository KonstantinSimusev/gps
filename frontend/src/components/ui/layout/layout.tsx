import styles from './layout.module.css';
import clsx from 'clsx';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: ILayoutProps) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};
