import styles from './main-layout.module.css';

import clsx from 'clsx';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className = '' }: ILayoutProps) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};
