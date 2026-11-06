import { IEmployeeInfo } from '../../../utils/api.interfaces';
import { formatDateFormUI, getRoleName } from '../../../utils/utils';

import { CardContainer } from '../../ui/card-container/card-container';
import { IconButton } from '../../ui/buttons/icon-button/icon-button';
import { TableBlock } from '../../ui/table-block/table-block';

import { EditIcon } from '../../ui/icons/edit/edit';
import { PasswordIcon } from '../../ui/icons/password/password';
import { ProfileIcon } from '../../ui/icons/profile/profile';

import styles from './employee-card.module.css';

interface IProps {
  employee: IEmployeeInfo;
  onUpdateEmployee: () => void;
  onUpdatePassword: () => void;
}

export const EmployeeCard = ({
  employee,
  onUpdateEmployee,
  onUpdatePassword,
}: IProps) => {
  return (
    <CardContainer className={styles.container}>
      <div className={styles.profile}>
        <ProfileIcon />
        <span className={styles.fullname}>
          <span>{`${employee.lastName} ${employee.firstName}`}</span>
          <span>{employee.patronymic}</span>
        </span>
        <span className={styles.profession}>{employee.professionName}</span>
      </div>

      <div className={styles.buttons}>
        <IconButton type='button' onClick={onUpdateEmployee}>
          <EditIcon width={28} height={28} />
        </IconButton>

        {employee.isActive === true && (
          <IconButton type='button' onClick={onUpdatePassword}>
            <PasswordIcon width={25} height={25} />
          </IconButton>
        )}
      </div>

      <div className={styles.table}>
        <span className={styles.tableTitle}>Личный кабинет</span>

        <TableBlock title='Цех' text={employee.profileWorkshopCode ?? '-'} />

        <TableBlock
          title='Бригада №'
          text={employee.profileTeamNumber ?? '-'}
        />

        <TableBlock
          title='Штатная позиция'
          text={employee.profilePositionCode ?? '-'}
        />

        <TableBlock title='Разряд' text={employee.profileGradeCode ?? '-'} />

        <TableBlock
          title='График работы'
          text={employee.profileScheduleCode ?? '-'}
        />

        <TableBlock
          title='Система оплаты'
          text={employee.profilePaymentCode ?? '-'}
        />
        
        <TableBlock title='Роль' text={getRoleName(employee.profileRoleName)} />

        <TableBlock
          title='Доступ'
          text={employee.hasAccess ? 'Разрешён' : 'Запрещён'}
        />
      </div>

      <div className={styles.table}>
        <span className={styles.tableTitle}>Книга личного состава</span>

        <TableBlock title='Цех' text={employee.workshopCode} />
        <TableBlock title='Бригада №' text={employee.teamNumber} />
        <TableBlock title='Личный №' text={employee.personalNumber} />
        <TableBlock title='Штатная позиция' text={employee.positionCode} />
        <TableBlock title='Разряд' text={employee.gradeCode} />
        <TableBlock title='График работы' text={employee.scheduleCode} />
        <TableBlock title='Система оплаты' text={employee.paymentCode} />

        <TableBlock
          title='Дата рождения'
          text={formatDateFormUI(employee.birthDay)}
        />

        <TableBlock
          title='Дата назначения'
          text={formatDateFormUI(employee.startDate)}
        />

        <TableBlock
          title='Дата увольнения'
          text={formatDateFormUI(employee.endDate)}
        />
      </div>
    </CardContainer>
  );
};
