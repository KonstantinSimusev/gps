import { CloseButton } from '../buttons/close/close';

import styles from './modal.module.css';

interface IProps {
  children?: React.ReactNode;
}

export const Modal = ({ children }: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <CloseButton />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
