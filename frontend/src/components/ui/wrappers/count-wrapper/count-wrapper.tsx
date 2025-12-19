import styles from './count-wrapper.module.css';

import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const CountWrapper = ({ children }: IProps) => {
  return <div className={styles.container}>{children}</div>;
};
