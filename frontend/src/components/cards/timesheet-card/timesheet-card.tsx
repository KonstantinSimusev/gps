import { IEmployee } from '../../../utils/api.interface';
import { formatDateForUI } from '../../../utils/utils';

import { CardContainer } from '../../ui/card-container/card-container';
import { IconButton } from '../../ui/buttons/icon-button/icon-button';
import { InfoBlock } from '../../ui/info-block/info-block';
import { TableBlock } from '../../ui/table-block/table-block';

import { EditIcon } from '../../ui/icons/edit/edit';
import { ProfileIcon } from '../../ui/icons/profile/profile';
import { SuccessIcon } from '../../ui/icons/success/success';

import styles from './timesheet-card.module.css';

interface IProps {
  employee: IEmployee;
  onClick: () => void;
}

export const TimesheetCard = ({ employee, onClick }: IProps) => {
  return (
    <CardContainer className={styles.container}>
      <div className={styles.success}>
        {employee.shift.status !== 'Не выбрано' && (
          <SuccessIcon width={30} height={30} />
        )}
      </div>
      <div className={styles.profile}>
        <ProfileIcon />
        <span className={styles.fullname}>
          <span>{`${employee.lastName} ${employee.firstName}`}</span>
          <span>{employee.patronymic}</span>
        </span>
        <span className={styles.profession}>{employee.profession}</span>
      </div>

      <div className={styles.table}>
        <TableBlock title='Личный номер' text={employee.personalNumber} />
        <TableBlock title='Штатная позиция' text={employee.positionCode} />
        <TableBlock title='Разряд' text={employee.grade} />
        <TableBlock title='График работы' text={employee.schedule} />
        <TableBlock
          title='Дата рождения'
          text={formatDateForUI(employee.birthDay)}
        />
      </div>

      <div className={styles.timesheet}>
        <div className={styles.status}>
          <InfoBlock
            title='Статус работы'
            text={employee.shift.status}
          />
          <IconButton type='button' onClick={onClick} className={styles.button}>
            <EditIcon width={22} height={22} />
          </IconButton>
        </div>

        <InfoBlock
          title='Профессия в смене'
          text={employee.shift.profession}
        />
        <InfoBlock
          title='Рабочее место'
          text={employee.shift.area}
        />
        <InfoBlock
          title='Отработано часов'
          text={employee.shift.hours}
        />
      </div>
    </CardContainer>
  );
};
