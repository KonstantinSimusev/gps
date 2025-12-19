import styles from './header.module.css';

import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const HeaderWrapper = ({ children }: IProps) => {
  return <div className={styles.container}>{children}</div>;
};
