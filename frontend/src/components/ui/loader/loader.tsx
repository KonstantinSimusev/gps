import styles from './loader.module.css';

interface IProps {
  text?: string;
}

export const Loader = ({ text = 'Загрузка' }: IProps) => {
  return (
    <span
      className={styles.container}
    >
      {text}
    </span>
  );
};
