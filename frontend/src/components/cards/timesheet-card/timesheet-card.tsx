import { formatDurationForUI } from '../../../utils/utils';
import { IEmployeeShift } from '../../../utils/api.interface';
import { ATTENDANCE_TYPE } from '../../../utils/types';

import { CardContainer } from '../../ui/card-container/card-container';
import { IconButton } from '../../ui/buttons/icon-button/icon-button';
import { InfoBlock } from '../../ui/info-block/info-block';
import { TableBlock } from '../../ui/table-block/table-block';

import { EditIcon } from '../../ui/icons/edit/edit';
import { ProfileIcon } from '../../ui/icons/profile/profile';
import { SuccessIcon } from '../../ui/icons/success/success';

import styles from './timesheet-card.module.css';

interface IProps {
  employeeShift: IEmployeeShift;
  onClick: () => void;
}

export const TimesheetCard = ({ employeeShift, onClick }: IProps) => {
  const employee = employeeShift.employee;
  const attendanceType = employeeShift.attendanceType;
  const workPlace = employeeShift.workPlace;

  const position = employee?.position;
  const profession = position?.profession;
  const grade = position?.grade;
  const schedule = position?.schedule;

  const isShowSuccess =
    attendanceType.attendanceCode === ATTENDANCE_TYPE.V ||
    employeeShift.workPlace !== null;

  const workTime = formatDurationForUI(employeeShift.minutes);

  const svsStatus =
    employeeShift.isPresent === null
      ? ATTENDANCE_TYPE.V // если null → считаем выходным
      : employeeShift.isPresent
        ? '+' // если true → «+»
        : '-'; // если false → «-»

  return (
    <CardContainer className={styles.container}>
      <div className={styles.success}>
        {isShowSuccess && <SuccessIcon width={30} height={30} />}
      </div>
      <div className={styles.profile}>
        <ProfileIcon />
        <span className={styles.fullname}>
          <span>
            {`${employee?.lastName ?? ''} ${employee?.firstName ?? ''}`}
          </span>
          <span>{employee?.patronymic ?? ''}</span>
        </span>
        <span className={styles.profession}>
          {profession?.name ?? 'Не указано'}
        </span>
      </div>

      <div className={styles.table}>
        <TableBlock
          title='Личный номер'
          text={employee?.personalNumber ?? '-'}
        />
        <TableBlock
          title='Штатная позиция'
          text={position?.positionCode ?? '-'}
        />
        <TableBlock title='Разряд' text={grade?.gradeCode ?? '-'} />
        <TableBlock
          title='График работы'
          text={schedule?.scheduleCode ?? '-'}
        />
      </div>

      <div className={styles.timesheet}>
        <div className={styles.status}>
          <InfoBlock
            title='Статус работы'
            text={attendanceType?.attendanceCode ?? '-'}
          />
          <IconButton type='button' onClick={onClick} className={styles.button}>
            <EditIcon width={22} height={22} />
          </IconButton>
        </div>

        <InfoBlock title='Сменно-встречное собрание' text={svsStatus} />
        <InfoBlock title='Профессия в смене' text={profession?.name ?? '-'} />
        <InfoBlock
          title='Рабочее место'
          text={workPlace?.name ?? 'Не выбрано'}
        />
        <InfoBlock title='Отработаное время' text={workTime} />
      </div>

      {/* <TableBlock
          title='Причина перевода'
          text={employee.transferReason ?? '-'}
        />

        <TableBlock
          title='Личный номер заменяемого'
          text={employee.replacedPersonalNumber ?? '-'}
        />

        <TableBlock
          title='Дата назначения позиции'
          text={employee.positionStartDate ?? '-'}
        />

        <TableBlock
          title='Дата завершения позиции'
          text={employee.positionEndDate ?? '-'}
        /> */}
    </CardContainer>
  );
};
