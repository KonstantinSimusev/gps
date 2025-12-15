import clsx from 'clsx';
import styles from './info-block.module.css';

interface IInfoBlockProps {
  className?: string;
  title: string;
  text: string | number;
}

export const InfoBlock = ({ className, title, text }: IInfoBlockProps) => {
  return (
    <div className={styles.container}>
      <span className={clsx(className, styles.title)}>{title}</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
};
