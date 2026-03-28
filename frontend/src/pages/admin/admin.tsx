import { useContext } from 'react';

import { LayerContext } from '../../contexts/layer/layerContext';
import { useSelector } from '../../services/store';
import { selectEmployee } from '../../services/slices/employee/slice';

import { MainLayout } from '../../components/ui/layouts/main/main-layout';
import { Button } from '../../components/ui/button/button';
import { CardContainer } from '../../components/ui/card-container/card-container';
import { InfoBlock } from '../../components/ui/info-block/info-block';
import { EditButton } from '../../components/buttons/edit/edit';
import { DeleteButton } from '../../components/buttons/delete/delete';

import { formatDate } from '../../utils/utils';

import styles from './admin.module.css';

export const Admin = () => {
  const { setIsOverlayOpen, setIsEmployeeSearchOpen, setIsEmployeeCreateOpen } =
    useContext(LayerContext);

  const employee = useSelector(selectEmployee);

  const searchEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeSearchOpen(true);
  };

  const createEmployee = () => {
    setIsOverlayOpen(true);
    setIsEmployeeCreateOpen(true);
  };

  return (
    <MainLayout>
      <div className={styles.button__wrapper}>
        <Button type='button' label='Поиск' onClick={searchEmployee} />
        <Button type='button' label='Создать' onClick={createEmployee} />
      </div>

      {employee && (
        <CardContainer className={styles.card__container}>
          <div className={styles.employee__wrapper}>
            <InfoBlock
              title='ФИО'
              text={`${employee.lastName}\n${employee.firstName}\n${employee.patronymic}`}
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
                text={formatDate(employee.birthDay)}
              />
            )}

            {employee.startDate && (
              <InfoBlock
                title='Дата назначения'
                text={formatDate(employee.startDate)}
              />
            )}

            {employee.endDate && (
              <InfoBlock
                title='Дата увольнения'
                text={formatDate(employee.endDate)}
              />
            )}

            {employee.role && <InfoBlock title='Роль' text={employee.role} />}
          </div>

          <div className={styles.buttons__wrapper}>
            <EditButton
              actionType='employee'
              iconWidth={24}
              iconHeight={24}
              id={employee.id}
            />

            <DeleteButton
              actionType='employee'
              iconWidth={24}
              iconHeight={24}
              id={employee.id}
            />
          </div>
        </CardContainer>
      )}
    </MainLayout>
  );
};
