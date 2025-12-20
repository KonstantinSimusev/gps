import styles from './loader.module.css';

interface IProps {
  text?: string;
  marginLeft?: number;
}

export const Loader = ({ text = 'Загрузка', marginLeft }: IProps) => {
  return (
    <span
      className={styles.container}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      {text}
    </span>
  );
};
