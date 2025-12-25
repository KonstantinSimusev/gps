import styles from './error.module.css';

interface IProps {
  text?: string;
}

export const Error = ({ text = 'Нет данных' }: IProps) => {
  return <span className={styles.container}>{text}</span>;
};
