import styles from './chart.module.css';

import { Border } from '../border/border';

interface IProps {
  list: {
    id: string;
    location?: string;
    unit?: string;
    railway?: string;
    area?: string;
    count: number;
    sortOrder?: number;
  }[];
}

export const Chart = ({ list }: IProps) => {
  // Фиксированная максимальная высота столбца — 300px
  const FIXED_MAX_HEIGHT = 60;

  return (
    <ul className={styles.container}>
      {list.map((item) => {
        // Если максимальное значение в данных равно 0, все столбцы будут нулевыми
        const maxDataValue = Math.max(...list.map((item) => item.count)) || 1;

        // Вычисляем высоту столбца в процентах от 300px
        const percentage = (item.count / maxDataValue) * 100;

        // Переводим процент в пиксели (от 0 до 60)
        const columnHeight = (percentage / 100) * FIXED_MAX_HEIGHT;

        return (
          <li key={item.id} className={styles.item}>
            <span
              style={{ height: `${columnHeight}px` }}
              className={styles.column}
            >
              <span className={styles.count}>
                {item.count > 0 ? item.count : ''}
              </span>
            </span>
            <Border />
            <span className={styles.title}>{item.location}</span>
          </li>
        );
      })}
    </ul>
  );
};
