import styles from './user-shift-list.module.css';

import { SuccessIcon } from '../../icons/success/success';
import { EditButton } from '../../buttons/edit/edit';
import { InfoBlock } from '../../ui/info-block/info-block';
import { UserBlock } from '../../ui/user-block/user-block';
import { DeleteButton } from '../../buttons/delete/delete';

import { IShift, IUserShift } from '../../../utils/api.interface';
import { filterWorkers } from '../../../utils/utils';

interface IProps {
  shift: IShift;
  list: IUserShift[];
}

export const UserShiftList = ({ shift, list }: IProps) => {
  const filterWorkersList = filterWorkers(list);

  return (
    <ul className={styles.container}>
      {filterWorkersList.map((userShift, index) => (
        <li key={userShift.id} className={styles.item}>
          <div className={styles.wrapper__header}>
            <span className={styles.index}>
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className={styles.wrapper__edit}>
              {userShift.workPlace !== 'Не выбрано' && (
                <SuccessIcon width={32} height={32} />
              )}

              <EditButton
                id={userShift.id}
                actionType='worker'
                iconWidth={30}
                iconHeight={30}
              />
            </div>
          </div>

          {userShift.user && (
            <UserBlock
              lastName={userShift.user.lastName}
              firstName={userShift.user.firstName}
              patronymic={userShift.user.patronymic}
            />
          )}

          <InfoBlock title='Статус работы' text={userShift.workStatus} />
          <InfoBlock
            title='Профессия в смене'
            text={userShift.shiftProfession}
          />
          <InfoBlock title='Рабочее место' text={userShift.workPlace} />

          <div className={styles.wrapper__delete}>
            <InfoBlock title='Отработано часов' text={userShift.workHours} />

            {userShift.user &&
              userShift.user.teamNumber !== shift?.teamNumber && (
                <DeleteButton
                  id={userShift.id}
                  actionType='userShift'
                  iconWidth={30}
                  iconHeight={30}
                />
              )}
          </div>
        </li>
      ))}
    </ul>
  );
};
