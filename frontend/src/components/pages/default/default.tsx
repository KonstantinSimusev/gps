import styles from './default.module.css';

import { useContext } from 'react';
import { LayerContext } from '../../../contexts/layer/layerContext';
import { Button } from '../../ui/button/button';
import { Layout } from '../../ui/layout/layout';

export const DefaultPage = () => {
  const { isCookie, setIsCookie } = useContext(LayerContext);

  return (
    <Layout>
      {isCookie && <p className={styles.text}>Пожалуйста, авторизуйтесь...</p>}
      {!isCookie && (
        <>
          <div className={styles.container}>
            <h4>Этот сайт использует:</h4>
            <ul className={styles.items}>
              <li>Cookie-файлы для сохранения авторизации</li>
              <li>LocalStorage для хранения настроек темы (светлая/тёмная)</li>
            </ul>
            <p>
              Эти технологии помогают сделать ваш опыт использования сайта более
              удобным и персонализированным.
            </p>
            <h4 className={styles.opacity}>Ваши права:</h4>
            <ul className={styles.items}>
              <li>Вы можете в любой момент изменить настройки</li>
              <li>
                Имеете право отказаться от использования этих технологий (это
                может повлиять на работу сайта)
              </li>
            </ul>
            <p>
              Продолжая использовать сайт, вы даёте согласие на обработку данных
              в соответствии с нашей политикой конфиденциальности
            </p>
          </div>

          <h3 className={styles.title__politic}>Политика конфиденциальности</h3>
          <ul className={styles.list__politic}>
            <li>
              <h4 className={styles.title}>1. Общие положения</h4>
              <p>
                Настоящая политика определяет порядок обработки и защиты
                информации, собираемой на сайте.
              </p>
            </li>
            <li>
              <h4 className={styles.title}>2. Цели обработки данных</h4>
              <ul className={styles.items}>
                <li>Авторизация пользователей через систему cookie</li>
                <li>
                  Сохранение настроек темы сайта (светлая/тёмная) в LocalStorage
                </li>
                <li>Улучшение пользовательского опыта</li>
              </ul>
            </li>
            <li>
              <h4 className={styles.title}>3. Виды собираемой информации</h4>
              <ul className={styles.items}>
                <li>Технические данные о браузере</li>
                <li>Настройки темы сайта</li>
                <li>Данные авторизации (через cookie)</li>
              </ul>
            </li>
            <li>
              <h4 className={styles.title}>4. Сроки хранения</h4>
              <ul className={styles.items}>
                <li>Cookie хранятся до момента выхода пользователя</li>
                <li>Настройки темы сохраняются до ручного удаления</li>
              </ul>
            </li>
            <li>
              <h4 className={styles.title}>5. Права пользователей</h4>
              <p className={styles.title}>Доступ к информации:</p>
              <ul className={styles.items}>
                <li>Технические данные о браузере</li>
                <li>Настройки темы сайта</li>
                <li>Данные авторизации (через cookie)</li>
              </ul>
            </li>
            <li>
              <h4 className={styles.title}>6. Безопасность данных</h4>
              <p>
                Мы обеспечиваем защиту собираемой информации с помощью
                современных технических средств.
              </p>
            </li>
            <li>
              <h4 className={styles.title}>7. Контактная информация</h4>
              <p>По вопросам обработки данных обращайтесь к администратору.</p>
            </li>
            <li>
              <h4 className={styles.title}>8. Изменения политики</h4>
              <p>Мы оставляем за собой право вносить изменения в политику.</p>
            </li>
          </ul>
          <div className={styles.wrapper__button}>
            <Button label={'Принять'} onClick={() => setIsCookie(true)} />
          </div>
        </>
      )}
    </Layout>
  );
};
