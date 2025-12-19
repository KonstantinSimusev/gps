import styles from './column.module.css';

import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const ColumnWrapper = ({ children }: IProps) => {
  return <div className={styles.container}>{children}</div>;
};
