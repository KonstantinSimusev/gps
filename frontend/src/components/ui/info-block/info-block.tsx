import clsx from 'clsx';

import styles from './info-block.module.css';

interface IProps {
  title: string;
  text: string;
  className?: string;
}

export const InfoBlock = ({ className, title, text }: IProps) => {
  return (
    <div className={clsx(className, styles.container)}>
      <span className={styles.title}>{title}</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
};
