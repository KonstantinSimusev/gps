import { formatNotificationDate } from '../../../utils/utils';
import { IMessage } from '../../../utils/api.interface';

import { Badge } from '../../ui/badge/badge';
import { ForwardIcon } from '../../ui/icons/forward/forward';
import { WarningIcon } from '../../ui/icons/warning/warning';

import styles from './notice-card.module.css';

interface IProps {
  msg: IMessage;
  onClick?: () => void;
}

export const NoticeCard = ({ msg, onClick }: IProps) => {
  return (
    <div className={styles.container} onClick={onClick}>
      {msg.isUnread && <Badge color='red' className={styles.badge__position} />}

      <div className={styles.title}>
        <span className={styles.title__text}>{msg.title}</span>
        <div className={styles.wrapper}>
          <span className={styles.date}>
            {formatNotificationDate(msg.createdAt)}
          </span>
          <ForwardIcon className={styles.forward__icon} />
        </div>
      </div>

      <div className={styles.status}>
        <span className={styles.status__text}>{msg.statusText}</span>

        {!msg.isResolved && (
          <WarningIcon className={styles.warning__position} />
        )}
      </div>
    </div>
  );
};
