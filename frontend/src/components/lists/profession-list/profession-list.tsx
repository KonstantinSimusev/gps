import styles from './profession-list.module.css';

import { useLocation } from 'react-router-dom';

import { SuccessIcon } from '../../icons/success/success';
import { AddButton } from '../../buttons/add/add-button';
import {
  countNonAttendedProfessions,
  countProfessionsByAttendance,
  countProfessions,
  getCount,
  filterWorkers,
  filterMaster,
  countProfessionsByAddedAttendance,
} from '../../../utils/utils';
import { TShiftStatus, TWorkPlace } from '../../../utils/types';
import { InfoBlock } from '../../ui/info-block/info-block';
import { IUserShift } from '../../../utils/api.interface';
import { Border } from '../../ui/border/border';
import clsx from 'clsx';

interface IListProps {
  type?: string;
  list: IUserShift[];
  teamNumber: number;
}

export const TeamProfessionList = ({ type, list, teamNumber }: IListProps) => {
  const location = useLocation();
  const isTimesheetPage = location.pathname.includes('/timesheet');

  const workPlaceStatus: TWorkPlace = 'Не выбрано';
  const activeShift: TShiftStatus = 'активная';
  const finishedShift: TShiftStatus = 'завершённая';

  const workersShifts = filterWorkers(list);

  const bookUsers = workersShifts.filter(
    (userSift) => userSift.user?.teamNumber === teamNumber,
  );

  const masterUserShift = filterMaster(list);

  // Формируем полное ФИО мастера
  const masterFullName = masterUserShift
    ? `${masterUserShift.user?.lastName} ${masterUserShift.user?.firstName} ${masterUserShift.user?.patronymic}`
    : 'Нет данных...';

  // Формируем должность
  const masterProfession = masterUserShift
    ? masterUserShift.user?.profession
    : 'Нет данных...';

  const total = workersShifts.filter(
    (item) => item.workPlace !== workPlaceStatus,
  ).length;

  const professions = countProfessions(bookUsers);
  const attendanceProfessions = countProfessionsByAttendance(workersShifts);
  const nonAttendanceProfessions = countNonAttendedProfessions(bookUsers);
  const addedProfessions = countProfessionsByAddedAttendance(
    workersShifts,
    teamNumber,
  );

  return (
    <div className={styles.container}>
      <span className={styles.header__title}>ИНФОРМАЦИЯ О БРИГАДЕ</span>
      <>
        <InfoBlock title={'Руководитель'} text={masterFullName} />
        <InfoBlock title={'Должность'} text={masterProfession ?? ''} />
      </>

      <ul className={styles.wrapper__list}>
        <div className={styles.title__wrapper}>
          <span className={styles.worker__title}>Численность по КЛС</span>
          <span className={styles.worker__title}>Чел</span>
        </div>
        <Border />
        {professions.map((item, index) => (
          <li className={styles.wrapper} key={index}>
            <span className={styles.text}>{item.profession}</span>
            <span className={styles.count}>{item.count}</span>
          </li>
        ))}
        <Border />
        <div className={styles.total__employees}>
          <span>Всего:</span>
          <span className={styles.total}>{bookUsers.length}</span>
        </div>
      </ul>

      <ul className={styles.wrapper__list}>
        <div className={styles.title__wrapper}>
          {(type === activeShift || !type) && (
            <span className={styles.worker__title}>Сегодня работают</span>
          )}
          {type === finishedShift && (
            <span className={styles.worker__title}>Работали в смене</span>
          )}
          <span className={styles.worker__title}>Чел</span>
        </div>

        <Border />
        {attendanceProfessions.length > 0 ? (
          attendanceProfessions.map((item, index) => (
            <li className={styles.wrapper} key={index}>
              <span className={styles.text}>{item.profession}</span>
              <span className={styles.count}>{item.count}</span>
            </li>
          ))
        ) : (
          <span className={styles.empty}>Нет данных</span>
        )}
        <Border />
        <div className={styles.total__employees}>
          <span>Всего:</span>
          <span className={styles.total}>
            {getCount(attendanceProfessions)}
          </span>
        </div>
      </ul>

      {addedProfessions.length > 0 && (
        <ul className={styles.wrapper__list}>
          <div className={styles.title__wrapper}>
            <span className={styles.worker__title}>Дополнительно вышли</span>
            <span className={styles.worker__title}>Чел</span>
          </div>
          <Border />
          {addedProfessions.map((item, index) => (
            <li className={styles.wrapper} key={index}>
              <span className={styles.text}>{item.profession}</span>
              <div className={styles.wrapper__reason}>
                <span className={styles.text__width}>БР-{item.teamNumber}</span>
                <span className={clsx(styles.count, styles.count__width)}>
                  {item.count}
                </span>
              </div>
            </li>
          ))}
          <Border />
          <div className={styles.total__employees}>
            <span>Всего:</span>
            <span className={styles.total}>{getCount(addedProfessions)}</span>
          </div>
        </ul>
      )}

      <ul className={styles.wrapper__list}>
        <div className={styles.title__wrapper}>
          {(type === activeShift || !type) && (
            <span className={styles.worker__title}>Сегодня отсутствуют</span>
          )}
          {type === finishedShift && (
            <span className={styles.worker__title}>Отсутствовали в смене</span>
          )}
          <span className={styles.worker__title}>Чел</span>
        </div>
        <Border />
        {nonAttendanceProfessions.length > 0 ? (
          nonAttendanceProfessions.map((item, index) => (
            <li className={styles.wrapper} key={index}>
              <span className={styles.text}>{item.profession}</span>
              <div className={styles.wrapper__reason}>
                <span className={clsx(styles.text__reason, styles.text__width)}>
                  {item.reason}
                </span>
                <span className={clsx(styles.count, styles.count__width)}>
                  {item.count}
                </span>
              </div>
            </li>
          ))
        ) : (
          <span className={styles.empty}>Нет данных</span>
        )}
        <Border />
        <div className={styles.total__employees}>
          <span>Всего:</span>
          <span className={styles.total}>
            {getCount(nonAttendanceProfessions)}
          </span>
        </div>
      </ul>

      <div className={styles.wrapper__info}>
        <div className={styles.wrapper__success}>
          <div className={styles.wrapper__text}>
            <span>Отмечено работников</span>

            {total === workersShifts.length && (
              <SuccessIcon width={18} height={18} />
            )}
          </div>
          <span className={styles.count}>{total}</span>
        </div>
        <Border className={styles.border__top} />
      </div>

      {isTimesheetPage && (
        <div className={styles.wrapper__button}>
          <AddButton label={'Добавить работника'} actionType="worker" />
        </div>
      )}
    </div>
  );
};
