import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch, useSelector } from '../../../services/store';

import { getNoticeById } from '../../../services/slices/notice/actions';

import {
  selectIsGetNoticeByIdLoading,
  selectNotice,
} from '../../../services/slices/notice/slice';

import { BackIcon } from '../../../components/ui/icons/back/back';
import { BlockingLoader } from '../../../components/ui/blocking-loader/blocking-loader';
import { IconButton } from '../../../components/ui/buttons/icon-button/icon-button';

import styles from './notice-item-page.module.css';

export const NoticeItemPage = () => {
  const { setSelectedId } = useContext(LayerContext);

  const navigate = useNavigate();
  const { noticeId } = useParams();

  const dispatch = useDispatch();

  const notice = useSelector(selectNotice);
  const isLoading = useSelector(selectIsGetNoticeByIdLoading);

  useEffect(() => {
    if (noticeId) {
      dispatch(getNoticeById(noticeId));
    }
  }, []);

  const handleBackClick = () => {
    if (noticeId) {
      setSelectedId(noticeId);
    }

    navigate(-1);
  };

  // 1. Грузимся -> показываем лоадер
  if (isLoading) {
    return <BlockingLoader />;
  }

  return (
    <>
      <IconButton
        type='button'
        onClick={handleBackClick}
        className={styles.button}
      >
        <BackIcon className={styles.back__icon} />
      </IconButton>
      <p>Notice Item Page</p>
      <p>Три шаблона открываются по условию полей:</p>
      <div>
        <p>- categoryCode</p>
        <p>- actionCode</p>
      </div>

      <p>Данные уведомления</p>
      {notice && (
        <div>
          <div>
            <p>ID: {notice.id}</p>
            <p>Source ID: {notice.sourceId ?? '—'}</p>
            <p>Source Date: {notice.sourceDate ?? '—'}</p>
            <p>Category Code: {notice.categoryCode}</p>
            <p>Title Text: {notice.titleText}</p>
            <p>Status Label: {notice.statusLabel}</p>
            <p>Action Code: {notice.actionCode}</p>
            <p>Action Label: {notice.actionLabel}</p>
            <p>Workshop Code: {notice.workshopCode}</p>
            <p>Team Number: {notice.teamNumber}</p>
            <p>Schedule Code: {notice.scheduleCode}</p>
            <p>Is Unread: {String(notice.isUnread)}</p>
            <p>Is Resolved: {String(notice.isResolved)}</p>
            <p>Created At: {notice.createdAt}</p>
          </div>
        </div>
      )}
    </>
  );
};
