import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { LayerContext } from '../../contexts/layer/layerContext';

import {
  countNonAttendedProfessions,
  countProfessionsByAttendance,
  countProfessions,
  getCount,
  filterWorkers,
  filterMaster,
  countProfessionsByAddedAttendance,
} from '../../utils/utils';

import { TWorkPlace } from '../../utils/types';
import { IUserShift } from '../../utils/api.interface';

import { CardContainer } from '../ui/card-container/card-container';
import { InfoBlock } from '../ui/info-block/info-block';
import { ProfessionTable } from '../ui/profession-table/profession-table';
import { Border } from '../ui/border/border';
import { SuccessIcon } from '../ui/icons/success/success';
import { Button } from '../ui/button/button';

import styles from './team-info.module.css';

interface IProps {
  teamNumber: number;
  list: IUserShift[];
}

export const TeamInfo = ({ teamNumber, list }: IProps) => {
  const { setIsOpenOverlay, setIsAddWorkerOpenModall } =
    useContext(LayerContext);

  const location = useLocation();
  const isTimesheetPage = location.pathname === '/timesheet';

  const workPlaceStatus: TWorkPlace = 'Не выбрано';

  const workersShifts = filterWorkers(list);

  const bookUsers = workersShifts.filter(
    (userSift) => userSift.user?.teamNumber === teamNumber,
  );

  const masterUserShift = filterMaster(list);

  // Формируем полное ФИО мастера
  const masterFullName = masterUserShift
    ? `${masterUserShift.user?.lastName} ${masterUserShift.user?.firstName} ${masterUserShift.user?.patronymic}`
    : 'Нет данных';

  // Формируем должность
  const masterProfession = masterUserShift
    ? masterUserShift.user?.profession
    : 'Нет данных';

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

  const handleClick = () => {
    setIsOpenOverlay(true);
    setIsAddWorkerOpenModall(true);
  };

  return (
    <CardContainer>
      <span>ИНФОРМАЦИЯ О БРИГАДЕ</span>
      <>
        <InfoBlock
          title='Структурное подразделение'
          text={`УУМ ${masterUserShift?.user?.workshopCode ?? ''}`}
        />
        <InfoBlock title='Руководитель' text={masterFullName} />
        <InfoBlock title='Должность' text={masterProfession ?? ''} />
      </>

      <ProfessionTable
        title='Численность по КЛС'
        list={professions}
        total={bookUsers.length}
      />

      {attendanceProfessions.length > 0 && (
        <ProfessionTable
          title='Вышли на работу'
          list={attendanceProfessions}
          total={getCount(attendanceProfessions)}
        />
      )}

      {nonAttendanceProfessions.length > 0 && (
        <ProfessionTable
          title='Не вышли на работу'
          list={nonAttendanceProfessions}
          total={getCount(nonAttendanceProfessions)}
        />
      )}

      {addedProfessions.length > 0 && (
        <ProfessionTable
          title='Вышли дополнительно'
          list={addedProfessions}
          total={getCount(addedProfessions)}
        />
      )}

      <div className={styles.section__wrapper}>
        <div className={styles.section__wrapper_success}>
          <div className={styles.section__text}>
            <span>Отмечено работников</span>
            {total === workersShifts.length && (
              <SuccessIcon width={18} height={18} />
            )}
          </div>
          <span className={styles.section__count}>{total}</span>
        </div>
        <Border className={styles.spacer} />
      </div>

      {isTimesheetPage && (
        <div className={styles.button__wrapper}>
          <Button
            type='button'
            label='Добавить работника'
            className={styles.button_accent}
            onClick={handleClick}
          />
        </div>
      )}
    </CardContainer>
  );
};
