import styles from './shift-info.module.css';

import { InfoBlock } from '../ui/info-block/info-block';
import { Error } from '../ui/error/error';

import { formatDate } from '../../utils/utils';

interface IShiftInfoProps {
  date: Date;
  shiftNumber: number;
  teamNumber: number;
  master?: string;
  position?: string;
}

export const ShiftInfo = ({
  date,
  shiftNumber,
  teamNumber,
}: IShiftInfoProps) => {
  return (
    <>
      {date && shiftNumber && teamNumber ? (
        <div className={styles.container}>
          <InfoBlock title={'Дата'} text={formatDate(date)} />
          <InfoBlock title={'№ смены'} text={`Смена ${shiftNumber}`} />
          <InfoBlock title={'№ бригады'} text={`Бригада ${teamNumber}`} />
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};
