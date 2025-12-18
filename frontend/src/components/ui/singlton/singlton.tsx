import styles from './singlton.module.css';

import { ReactNode } from 'react';

interface IProps {
  width?: number;
  height?: number;
  isLoading: boolean;
  element: ReactNode;
}

export const Singlton = ({ width, height, isLoading, element }: IProps) => {
  return (
    <>
      {isLoading ? (
        <div
          className={styles.container}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        ></div>
      ) : (
        element
      )}
    </>
  );
};
