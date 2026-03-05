import styles from './error.module.css';

interface IProps {
  text: string;
}

export const Error = ({ text }: IProps) => {
  return <span className={styles.container}>{text}</span>;
};
