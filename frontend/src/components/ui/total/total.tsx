import styles from './total.module.css';

interface IProps {
  count: number;
}

export const Total = ({ count }: IProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.text}>Итого:</span>
      <span className={styles.text}>{count} рул</span>
    </div>
  );
};
