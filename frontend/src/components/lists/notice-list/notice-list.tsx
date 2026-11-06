import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { INotice } from '../../../utils/api.interfaces';

import { useDispatch } from '../../../services/store';
import { markNoticeAsRead } from '../../../services/slices/notice/actions';

import { NoticeCard } from '../../cards/notice-card/notice-card';

import styles from './notice-list.module.css';

interface IProps {
  notices: INotice[];
}

export const NoticeList = ({ notices }: IProps) => {
  const { selectedId, setSelectedId } = useContext(LayerContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNoticeClick = (noticeId: string) => {
    setSelectedId(noticeId);
    dispatch(markNoticeAsRead(noticeId));
    navigate(`/notices/${noticeId}`);
  };

  return (
    <>
      {notices.length > 0 && (
        <div className={styles.container}>
          <span className={styles.notice}>
            <span className={styles.text}>Уведомлений:</span>
            <span className={styles.count}>{notices.length}</span>
          </span>

          <ul className={styles.list}>
            {notices.map((notice) => (
              <li key={notice.id} className={styles.item}>
                <NoticeCard
                  notice={notice}
                  selectedNoticeId={selectedId}
                  onClick={() => handleNoticeClick(notice.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
