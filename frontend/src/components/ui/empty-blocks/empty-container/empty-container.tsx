import styles from './empty-container.module.css';

export const EmptyContainer = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loading}>Идет загрузка...</span>
    </div>
  );
};
