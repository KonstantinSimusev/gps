import styles from './blocking-loader.module.css';

interface IProps {
  text?: string;
}

export const BlockingLoader = ({ text}: IProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader} />
      <span className={styles.container}>{text}</span>
    </div>
  );
};
