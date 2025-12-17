import styles from './location.module.css';

interface IProps {
  title: string;
}

export const Location = ({ title }: IProps) => {
  return <span className={styles.container}>{title}</span>;
};
