import styles from './page-title.module.css';

interface IPageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: IPageTitleProps) => {
  return <h5 className={styles.container}>{title}</h5>;
};
