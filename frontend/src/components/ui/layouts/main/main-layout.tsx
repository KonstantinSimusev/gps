import styles from './main-layout.module.css';

import clsx from 'clsx';

interface ILayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const MainLayout = ({ className, children }: ILayoutProps) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};
