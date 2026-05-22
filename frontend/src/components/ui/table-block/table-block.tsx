import clsx from 'clsx';

import { Border } from '../border/border';

import styles from './table-block.module.css';

interface IProps {
  title: string;
  text: string | number;
  className?: string;
}

export const TableBlock = ({ title, text, className }: IProps) => {
  return (
    <div className={clsx(className, styles.container)}>
      <div className={styles.block}>
        <span className={styles.title}>{title}</span>
        <span className={styles.text}>{text}</span>
      </div>
      <Border />
    </div>
  );
};
