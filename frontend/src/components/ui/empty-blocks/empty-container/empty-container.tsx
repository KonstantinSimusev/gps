import styles from './empty-container.module.css';

interface IProps {
  height: string;
}

export const EmptyContainer = ({ height }: IProps) => {
  return (
    <div className={styles.container} style={{ height: height || '400px' }}>
      <span className={styles.loading}>Идет загрузка...</span>
    </div>
  );
};
