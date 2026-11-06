import { formatNotificationDate } from '../../../utils/utils';
import { INotice } from '../../../utils/api.interfaces';

import { Badge } from '../../ui/badge/badge';
import { ForwardIcon } from '../../ui/icons/forward/forward';
import { WarningIcon } from '../../ui/icons/warning/warning';

import styles from './notice-card.module.css';
import clsx from 'clsx';

interface IProps {
  notice: INotice;
  selectedNoticeId?: string | null;
  onClick?: () => void;
}

export const NoticeCard = ({ notice, selectedNoticeId, onClick }: IProps) => {
  const isActive = selectedNoticeId === notice.id;

  return (
    <div
      className={clsx(styles.container, isActive && styles.container__active)}
      onClick={onClick}
    >
      {notice.isUnread && (
        <Badge color='red' className={styles.badge__position} />
      )}

      <div className={styles.title}>
        <span className={styles.title__text}>{notice.titleText}</span>
        <div className={styles.wrapper}>
          <span className={styles.date}>
            {formatNotificationDate(notice.createdAt)}
          </span>
          <ForwardIcon className={styles.forward__icon} />
        </div>
      </div>

      <div className={styles.status}>
        <span className={styles.status__text}>{notice.statusLabel}</span>

        {!notice.isResolved && (
          <WarningIcon className={styles.warning__position} />
        )}
      </div>
    </div>
  );
};
