import styles from './total.module.css';

interface IProps {
  text: string;
  count: number;
  unit: string;
}

export const Total = ({ text, count, unit }: IProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.text}>{text}</span>
      <span className={styles.text}>{count} {unit}</span>
    </div>
  );
};
