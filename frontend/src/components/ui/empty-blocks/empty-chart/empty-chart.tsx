import styles from './empty-chart.module.css';

export const EmptyChart = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loading}>Идет загрузка...</span>
    </div>
  );
};
