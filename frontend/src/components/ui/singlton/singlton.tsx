import styles from './singlton.module.css';

import { ReactNode, useEffect, useState } from 'react';

interface IProps {
  width?: number;
  height?: number;
  isLoading: boolean;
  element: ReactNode;
}

export const Singlton = ({ width, height, isLoading, element }: IProps) => {
  // Флаг: true → ждём 1 сек, false → показываем реальный isLoading
  const [isDelayed, setIsDelayed] = useState(true);

  useEffect(() => {
    // Запускаем таймер на 1000 мс
    const timer = setTimeout(() => {
      setIsDelayed(false);
    }, 1000);

    // Очистка таймера при удалении компонента
    return () => clearTimeout(timer);
  }, []); // Пустой массив → эффект срабатывает только при монтировании

  // Если идёт задержка (isDelayed === true) → показываем заглушку
  // Иначе → показываем то, что пришло в пропсе isLoading
  const finalIsLoading = isDelayed ? true : isLoading;
  return (
    <>
      {finalIsLoading ? (
        <div
          className={styles.container}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        ></div>
      ) : (
        element
      )}
    </>
  );
};
