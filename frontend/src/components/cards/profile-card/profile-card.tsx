import { useContext } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { useSelector } from '../../../services/store';
import { selectProfile } from '../../../services/slices/auth/slice';
import { selectSearсhEmployee } from '../../../services/slices/employee/slice';

import { formatDateForUI } from '../../../utils/utils';

import { CardContainer } from '../../../components/ui/card-container/card-container';
import { InfoBlock } from '../../../components/ui/info-block/info-block';
import { ProfileIcon } from '../../../components/ui/icons/profile/profile';
import { EditIcon } from '../../../components/ui/icons/edit/edit';
import { IconButton } from '../../../components/ui/icon-button/icon-button';
import { DeleteIcon } from '../../../components/ui/icons/delete/delete';
import { PasswordIcon } from '../../../components/ui/icons/password/password';

import styles from './profile-card.module.css';

export const ProfileCard = () => {
  const {
    setIsOverlayOpen,
    setIsEmployeeEditOpen,
    setIsEmployeeDeleteOpen,
    setIsPasswordUpdateOpen,
    setSelectedId,
  } = useContext(LayerContext);

  const profile = useSelector(selectProfile);
  const employee = useSelector(selectSearсhEmployee);

  const updatePassword = () => {
    if (!employee) {
      return;
    }

    if (employee.isActive === true) {
      setSelectedId(employee.id);
      setIsOverlayOpen(true);
      setIsPasswordUpdateOpen(true);
    }
  };

  const updateProfile = () => {
    if (!employee) {
      return;
    }

    setSelectedId(employee.id);
    setIsOverlayOpen(true);
    setIsEmployeeEditOpen(true);
  };

  const deleteProfile = () => {
    if (!employee) {
      return;
    }

    setSelectedId(employee.id);
    setIsOverlayOpen(true);
    setIsEmployeeDeleteOpen(true);
  };

  return (
    <>
      {employee && (
        <CardContainer className={styles.card__container}>
          <div className={styles.profile}>
            <ProfileIcon />
            <span className={styles.fullname}>
              <span>{`${employee.lastName} ${employee.firstName}`}</span>
              <span>{employee.patronymic}</span>
            </span>
          </div>

          {profile?.workshopCode === employee.workshop && (
            <div className={styles.buttons__wrapper}>
              <IconButton type='button' onClick={updateProfile}>
                <EditIcon width={26} height={26} />
              </IconButton>

              {employee.isActive === true && (
                <IconButton type='button' onClick={updatePassword}>
                  <PasswordIcon width={23} height={23} />
                </IconButton>
              )}

              <IconButton type='button' onClick={deleteProfile}>
                <DeleteIcon width={26} height={26} />
              </IconButton>
            </div>
          )}

          <div className={styles.employee__wrapper}>
            <InfoBlock title='Профессия' text={employee.profession} />
            <InfoBlock title='Цех' text={employee.workshop} />
            <InfoBlock title='Бригада' text={employee.team} />
            <InfoBlock title='Личный номер' text={employee.personalNumber} />
            <InfoBlock title='Штатная позиция' text={employee.positionCode} />
            <InfoBlock title='Разряд' text={employee.grade} />
            <InfoBlock title='График' text={employee.schedule} />

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

            {employee.role && <InfoBlock title='Роль' text={employee.role} />}
          </div>
        </CardContainer>
      )}
    </>
  );
};
