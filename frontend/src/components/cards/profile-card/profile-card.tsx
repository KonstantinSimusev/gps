import { formatDateForUI, getRoleLabel } from '../../../utils/utils';
import { IEmployeeInfo, IProfile } from '../../../utils/api.interface';

import { CardContainer } from '../../../components/ui/card-container/card-container';
import { IconButton } from '../../../components/ui/icon-button/icon-button';
import { InfoBlock } from '../../../components/ui/info-block/info-block';

import { DeleteIcon } from '../../../components/ui/icons/delete/delete';
import { EditIcon } from '../../../components/ui/icons/edit/edit';
import { PasswordIcon } from '../../../components/ui/icons/password/password';
import { ProfileIcon } from '../../../components/ui/icons/profile/profile';

import styles from './profile-card.module.css';

interface IProfileCardProps {
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
}: IProfileCardProps) => {
  return (
    <CardContainer className={styles.card__container}>
      <div className={styles.profile}>
        <ProfileIcon />
        <span className={styles.fullname}>
          <span>{`${employee.lastName} ${employee.firstName}`}</span>
          <span>{employee.patronymic}</span>
        </span>
        <span className={styles.profession}>{employee.profession}</span>
      </div>

      {profile?.workshopCode === employee.workshop && (
        <div className={styles.buttons__wrapper}>
          <IconButton type='button' onClick={onUpdateProfile}>
            <EditIcon width={30} height={30} />
          </IconButton>

          {employee.isActive === true && (
            <IconButton type='button' onClick={onUpdatePassword}>
              <PasswordIcon width={27} height={27} />
            </IconButton>
          )}

          <IconButton type='button' onClick={onDeleteProfile}>
            <DeleteIcon width={30} height={30} />
          </IconButton>
        </div>
      )}

      <div className={styles.employee__wrapper}>
        <div className={styles.container}>
          <InfoBlock title='Цех' text={employee.workshop} />
          <InfoBlock title='Бригада' text={employee.team} />
          <InfoBlock title='Личный номер' text={employee.personalNumber} />
          <InfoBlock title='Штатная позиция' text={employee.positionCode} />
          <InfoBlock title='Разряд' text={employee.grade} />
          <InfoBlock title='График' text={employee.schedule} />
        </div>

        <div className={styles.container}>
          {employee.birthDay && (
            <InfoBlock
              title='Дата рождения'
              text={formatDateForUI(employee.birthDay)}
            />
          )}

          {employee.startDate && (
            <InfoBlock
              title='Дата назначения'
              text={formatDateForUI(employee.startDate)}
            />
          )}

          {employee.endDate && (
            <InfoBlock
              title='Дата увольнения'
              text={formatDateForUI(employee.endDate)}
            />
          )}
        </div>

        {employee.role && (
          <div className={styles.container}>
            <InfoBlock title='Роль' text={getRoleLabel(employee.role)} />
          </div>
        )}
      </div>
    </CardContainer>
  );
};
