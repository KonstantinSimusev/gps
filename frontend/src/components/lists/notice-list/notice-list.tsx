import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { IMessage } from '../../../utils/api.interface';
import { LayerContext } from '../../../contexts/layer/layerContext';

// import { useDispatch } from '../../../services/store';
import { NoticeCard } from '../../cards/notice-card/notice-card';

import styles from './notice-list.module.css';

interface IProps {
  messages: IMessage[];
}

export const NoticeList = ({ messages }: IProps) => {
  const { setSelectedId } = useContext(LayerContext);

  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // Фильтруем только нерешённые сообщения
  const unresolvedMessages = messages.filter((msg) => !msg.isResolved);

  // Считаем количество нерешённых задач
  const unresolvedCount = messages.reduce(
    (acc, m) => acc + (m.isResolved ? 0 : 1),
    0,
  );

  // Хелпер для определения пути перехода
  const getRedirectPath = (category: string, itemId: string) => {
    switch (category) {
      case 'shift':
        return `/shift/${itemId}`;
      case 'document':
        return `/documents/${itemId}`;
      default:
        return undefined;
    }
  };

  const handleMessageClick = (msg: IMessage) => {
    setSelectedId(msg.itemId);

    // Навигация
    const path = getRedirectPath(msg.category, msg.itemId);

    if (path) {
      navigate(path);
    }
  };

  if (messages.length === 0 || unresolvedCount === 0) {
    return <p className={styles.empty}>Нет уведомлений</p>;
  }

  return (
    <div className={styles.container}>
      <span className={styles.message}>
        <span className={styles.text}>Уведомлений:</span>
        <span className={styles.count}>{unresolvedMessages.length}</span>
      </span>

      <ul className={styles.list}>
        {unresolvedMessages.map((msg) => (
          <li key={msg.id} className={styles.item}>
            <NoticeCard msg={msg} onClick={() => handleMessageClick(msg)} />
          </li>
        ))}
      </ul>
    </div>
  );
};
