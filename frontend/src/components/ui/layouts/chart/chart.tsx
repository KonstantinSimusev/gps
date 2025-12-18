import styles from './chart.module.css';

import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const ChartLayout = ({ children }: IProps) => {
  return <div className={styles.container}>{children}</div>;
};
