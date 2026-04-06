import { useContext } from 'react';

import { LayerContext } from '../../contexts/layer/layerContext';
import { useSelector } from '../../services/store';
import { selectProfile } from '../../services/slices/auth/slice';
import { selectSearсhEmployee } from '../../services/slices/employee/slice';

import { formatDateForUI } from '../../utils/utils';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';
import { Button } from '../../components/ui/button/button';
import { CardContainer } from '../../components/ui/card-container/card-container';
import { InfoBlock } from '../../components/ui/info-block/info-block';

import styles from './admin.module.css';

export const Admin = () => {
  const {
    setIsOverlayOpen,
    setIsEmployeeSearchOpen,
    setIsEmployeeCreateOpen,
    setIsEmployeeEditOpen,
    setIsEmployeeDeleteOpen,
    setIsPasswordUpdateOpen,
    setSelectedId,
  } = useContext(LayerContext);

  const profile = useSelector(selectProfile);
  const employee = useSelector(selectSearсhEmployee);

  const searchEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeSearchOpen(true);
  };

  const createEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeCreateOpen(true);
  };

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
    <MainLayout>
      <div className={styles.buttons__wrapper}>
        <Button type='button' label='Поиск' onClick={searchEmployee} />
        <Button type='button' label='Создать' onClick={createEmployee} />
      </div>

      {employee && (
        <CardContainer className={styles.card__container}>
          <div className={styles.employee__wrapper}>
            <InfoBlock
              title='ФИО'
              text={`${employee.lastName} ${employee.firstName} ${employee.patronymic}`}
            />

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

          {profile?.workshopCode === employee.workshop && (
            <div className={styles.buttons__wrapper}>
              <Button
                type='button'
                label='Редактировать профиль'
                onClick={updateProfile}
                className={styles.button}
              />

              {employee.isActive === true && (
                <Button
                  type='button'
                  label='Обновить пароль'
                  onClick={updatePassword}
                />
              )}

              <Button
                type='button'
                label='Удалить профиль'
                onClick={deleteProfile}
              />
            </div>
          )}
        </CardContainer>
      )}
    </MainLayout>
  );
};
