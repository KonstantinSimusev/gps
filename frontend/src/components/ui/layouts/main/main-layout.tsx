import clsx from 'clsx';

import styles from './main-layout.module.css';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className }: IProps) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};
