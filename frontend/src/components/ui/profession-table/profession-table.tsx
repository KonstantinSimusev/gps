import { Border } from '../border/border';

import styles from './profession-table.module.css';

interface IProps {
  title: string;
  list: {
    profession: string;
    teamNumber?: number;
    reason?: string;
    count: number;
  }[];
  total: number;
}

export const ProfessionTable = ({ title, list, total }: IProps) => {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <span className={styles.header__title}>{title}</span>
        <span className={styles.header__title}>Чел</span>
      </div>
      <Border />
      <ul className={styles.list}>
        {list.map((item, index) => (
          <li className={styles.item} key={index}>
            <span className={styles.item__profession}>{item.profession}</span>
            <span>
              {item.teamNumber && <span>БР-{item.teamNumber}</span>}
              {item.reason && <span>{item.reason}</span>}
              <span className={styles.item__count}>{item.count}</span>
            </span>
          </li>
        ))}
      </ul>
      <Border />
      <div className={styles.footer}>
        <span>Всего:</span>
        <span className={styles.total}>{total}</span>
      </div>
    </section>
  );
};
