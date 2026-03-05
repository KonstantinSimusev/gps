import styles from './loader.module.css';

interface IProps {
  text?: string;
}

export const Loader = ({ text }: IProps) => {
  return <span className={styles.container}>{text}</span>;
};
