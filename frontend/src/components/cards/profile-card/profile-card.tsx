import { IEmployeeInfo, IProfile } from '../../../utils/api.interface';
import { formatDateFormUI, getRoleName } from '../../../utils/utils';

import { CardContainer } from '../../../components/ui/card-container/card-container';
import { IconButton } from '../../ui/buttons/icon-button/icon-button';
import { TableBlock } from '../../ui/table-block/table-block';

import { DeleteIcon } from '../../../components/ui/icons/delete/delete';
import { EditIcon } from '../../../components/ui/icons/edit/edit';
import { PasswordIcon } from '../../../components/ui/icons/password/password';
import { ProfileIcon } from '../../../components/ui/icons/profile/profile';

import styles from './profile-card.module.css';

interface IProps {
  employee: IEmployeeInfo;
  profile: IProfile | null;
  onUpdateProfile: () => void;
  onUpdatePassword: () => void;
  onDeleteProfile: () => void;
}

export const ProfileCard = ({
  employee,
  profile,
  onUpdateProfile,
  onUpdatePassword,
  onDeleteProfile,
}: IProps) => {
  return (
    <CardContainer className={styles.container}>
      <div className={styles.profile}>
        <ProfileIcon />
        <span className={styles.fullname}>
          <span>{`${employee.lastName} ${employee.firstName}`}</span>
          <span>{employee.patronymic}</span>
        </span>
        <span className={styles.profession}>{employee.profession}</span>
      </div>

      {profile?.workshopCode === employee.workshop && (
        <div className={styles.buttons}>
          <IconButton type='button' onClick={onUpdateProfile}>
            <EditIcon width={28} height={28} />
          </IconButton>

          {employee.isActive === true && (
            <IconButton type='button' onClick={onUpdatePassword}>
              <PasswordIcon width={25} height={25} />
            </IconButton>
          )}

          <IconButton type='button' onClick={onDeleteProfile}>
            <DeleteIcon width={28} height={28} />
          </IconButton>
        </div>
      )}

      <div className={styles.table}>
        <TableBlock title='Цех' text={employee.workshop} />
        <TableBlock title='Бригада' text={employee.teamNumber} />
        <TableBlock title='Личный номер' text={employee.personalNumber} />
        <TableBlock title='Штатная позиция' text={employee.positionCode} />
        <TableBlock title='Разряд' text={employee.grade} />
        <TableBlock title='График' text={employee.schedule} />
      </div>

      <div className={styles.table}>
        <TableBlock
          title='Текущая бригада'
          text={employee.currentTeamNumber ?? '-'}
        />

        <TableBlock
          title='Текущая штатная позиция'
          text={employee.currentPositionCode ?? '-'}
        />
      </div>

      <div className={styles.table}>
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

      <div className={styles.table}>
        <TableBlock title='Роль' text={getRoleName(employee.role)} />
        <TableBlock
          title='Доступ в кабинет'
          text={employee.hasAccess ? 'Разрешён' : 'Запрещён'}
        />
      </div>
    </CardContainer>
  );
};
