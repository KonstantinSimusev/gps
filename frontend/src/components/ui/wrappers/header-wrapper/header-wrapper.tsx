import styles from './header-wrapper.module.css';

import { ReactNode } from 'react';

interface IProps {
  gap?: number;
  children: ReactNode;
}

export const HeaderWrapper = ({ gap, children }: IProps) => {
  return (
    <div className={styles.container} style={{ gap: `${gap}px` }}>
      {children}
    </div>
  );
};
