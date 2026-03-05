import clsx from 'clsx';

import styles from './border.module.css';

interface IProps {
  className?: string;
}

export const Border = ({ className }: IProps) => {
  return <span className={clsx(styles.container, className)}></span>;
};
