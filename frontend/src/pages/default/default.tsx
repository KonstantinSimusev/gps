import { useContext } from 'react';

import { LayerContext } from '../../contexts/layer/layerContext';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';
import { Button } from '../../components/ui/button/button';

import styles from './default.module.css';

export const DefaultPage = () => {
  const { setIsOverlayOpen, setIsLoginOpen } = useContext(LayerContext);

  const handleClick = () => {
    setIsOverlayOpen(true);
    setIsLoginOpen(true);
  };

  return (
    <MainLayout className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.section__title}>Этот сайт использует:</h2>
        <ul className={styles.circle__list}>
          <li className={styles.circle__item}>
            Cookie-файлы для сохранения авторизации
          </li>
        </ul>
        <p>
          Эти технологии помогают сделать ваш опыт использования сайта более
          удобным и персонализированным.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.section__title}>Ваши права:</h2>
        <ul className={styles.circle__list}>
          <li className={styles.circle__item}>
            Имеете право отказаться от использования этих технологий (это может
            повлиять на работу сайта)
          </li>
        </ul>
        <p>
          Продолжая использовать сайт, вы даёте согласие на обработку данных в
          соответствии с нашей политикой конфиденциальности
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.section__title}>Политика конфиденциальности:</h2>

        <ol className={styles.number__list}>
          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>Общие положения</h3>
            <p>
              Настоящая политика определяет порядок обработки и защиты
              информации, собираемой на сайте.
            </p>
          </li>

          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>Цели обработки данных</h3>
            <ul className={styles.circle__list}>
              <li className={styles.circle__item}>
                Авторизация пользователей через систему cookie
              </li>
              <li className={styles.circle__item}>
                Улучшение пользовательского опыта
              </li>
            </ul>
          </li>

          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>
              Виды собираемой информации
            </h3>
            <ul className={styles.circle__list}>
              <li className={styles.circle__item}>
                Технические данные о браузере
              </li>
              <li className={styles.circle__item}>
                Данные авторизации (через cookie)
              </li>
            </ul>
          </li>

          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>Сроки хранения</h3>
            <ul className={styles.circle__list}>
              <li className={styles.circle__item}>
                Cookie хранятся до момента выхода пользователя
              </li>
            </ul>
          </li>

          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>Права пользователей</h3>
            <p className={styles.politic__text}>Доступ к информации:</p>
            <ul className={styles.circle__list}>
              <li className={styles.circle__item}>
                Технические данные о браузере
              </li>
              <li className={styles.circle__item}>
                Данные авторизации (через cookie)
              </li>
            </ul>
          </li>

          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>Безопасность данных</h3>
            <p>
              Мы обеспечиваем защиту собираемой информации с помощью современных
              технических средств.
            </p>
          </li>

          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>Контактная информация</h3>
            <p>По вопросам обработки данных обращайтесь к администратору.</p>
          </li>

          <li className={styles.number__item}>
            <h3 className={styles.politic__title}>Изменения политики</h3>
            <p>Мы оставляем за собой право вносить изменения в политику.</p>
          </li>
        </ol>
      </div>

      <input type='date' />

      <div className={styles.button__wrapper}>
        <Button type='button' label='Принять' onClick={handleClick} />
      </div>
    </MainLayout>
  );
};
