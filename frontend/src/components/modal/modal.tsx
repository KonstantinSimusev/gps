import styles from './modal.module.css';

import { CloseButton } from '../buttons/close/close';

interface IModalProps {
  children?: React.ReactNode;
}

export const Modal = ({ children }: IModalProps) => {

  return (
    <div className={styles.container}>
      <CloseButton />
      {children}
    </div>
  );
};
