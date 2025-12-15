import styles from './user-shift-list.module.css';

import { useEffect } from 'react';

import { EditButton } from '../../buttons/edit/edit';
import { DeleteButton } from '../../buttons/delete/delete';
import { SuccessIcon } from '../../icons/success/success';

import { useDispatch, useSelector } from '../../../services/store';
import { getUsersShifts } from '../../../services/slices/user-shift/actions';
import { selectUsersShifts } from '../../../services/slices/user-shift/slice';
import { InfoBlock } from '../../ui/info-block/info-block';
import { UserBlock } from '../../ui/user-block/user-block';
import { Error } from '../../ui/error/error';
import { selectCurrentShift } from '../../../services/slices/shift/slice';
import { filterWorkers } from '../../../utils/utils';
interface IUserShiftProps {
  shiftId?: string;
}

export const UserShiftList = ({ shiftId }: IUserShiftProps) => {
  const dispatch = useDispatch();
  const dataBaseUsersShifts = useSelector(selectUsersShifts);
  const shift = useSelector(selectCurrentShift);

  const workersShifts = filterWorkers(dataBaseUsersShifts);

  if (!shiftId) {
    return <Error />;
  }

  useEffect(() => {
    dispatch(getUsersShifts(shiftId));
  }, [dispatch, shiftId]);

  return (
    <ul className={styles.container}>
      {workersShifts.map((userShift, index) => (
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
                actionType="worker"
                iconWidth={30}
                iconHeight={30}
              />
            </div>
          </div>

          {userShift.user ? (
            <UserBlock
              lastName={userShift.user.lastName}
              firstName={userShift.user.firstName}
              patronymic={userShift.user.patronymic}
            />
          ) : (
            ''
          )}

          <InfoBlock title={'Статус работы'} text={userShift.workStatus} />
          <InfoBlock
            title={'Профессия в смене'}
            text={userShift.shiftProfession}
          />
          <InfoBlock title={'Рабочее место'} text={userShift.workPlace} />

          <div className={styles.wrapper__delete}>
            <InfoBlock title={'Отработано часов'} text={userShift.workHours} />

            {userShift.user &&
              userShift.user.teamNumber !== shift?.teamNumber && (
                <DeleteButton
                  id={userShift.id}
                  actionType="userShift"
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
