import { useEffect, useRef, useState } from 'react';

export const useLoaderWithDelay = (isLoading: boolean, delay = 300, minShow = 300) => {
  // Флаг: показывать ли лоадер сейчас
  const [show, setShow] = useState(false);
  // Время (в мс), когда лоадер реально появился на экране
  const shownAt = useRef(0);

  useEffect(() => {
    // Если загрузка закончилась — готовим скрытие лоадера
    if (!isLoading) {
      // Сколько времени лоадер уже висит на экране
      const elapsed = Date.now() - shownAt.current;
      // Сколько ещё нужно держать, чтобы суммарно было не меньше minShow
      const remaining = Math.max(0, minShow - elapsed);
      // Запускаем таймер на скрытие
      const hideTimer = setTimeout(() => setShow(false), remaining);

      // При размонтировании или смене флага — отменяем таймер скрытия
      return () => clearTimeout(hideTimer);
    }

    // Если загрузка началась — планируем появление лоадера через delay мс
    const showTimer = setTimeout(() => {
      shownAt.current = Date.now(); // запоминаем момент появления
      setShow(true);
    }, delay);

    // Если данные пришли быстрее, чем сработал таймер показа — отменяем этот таймер.
    // Так мы не покажем лоадер вообще и избежим «моргания».
    return () => clearTimeout(showTimer);
  }, [isLoading, delay, minShow]);

  return show;
};
