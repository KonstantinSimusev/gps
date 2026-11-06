import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../services/store';

import {
  createPendingShiftsNotices,
  getNotices,
} from '../../../services/slices/notice/actions';

import { selectNotices } from '../../../services/slices/notice/slice';

import { NoticeList } from '../../../components/lists/notice-list/notice-list';

import styles from './notice-list-page.module.css';

export const NoticeListPage = () => {
  const dispatch = useDispatch();
  const notices = useSelector(selectNotices);

  useEffect(() => {
    const loadNotices = async () => {
      await dispatch(createPendingShiftsNotices()).unwrap();
      await dispatch(getNotices()).unwrap();
    };

    loadNotices();
  }, []);

  // Нет данных — заглушка
  if (notices !== null && notices.length === 0) {
    return <p className={styles.empty}>Уведомлений нет</p>;
  }

  // 3. Есть данные — список
  return (
    <div className={styles.list__container}>
      <NoticeList notices={notices ?? []} />
    </div>
  );
};
