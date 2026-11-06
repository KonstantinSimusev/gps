import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import { selectProfile } from '../../../services/slices/auth/slice';
import { getShifts } from '../../../services/slices/shift/actions';

import {
  selectShifts,
  clearShifts,
} from '../../../services/slices/shift/slice';

import { InfoBlock } from '../../../components/ui/info-block/info-block';
import { ShiftList } from '../../../components/lists/shift-list/shift-list';

import styles from './timesheet-page.module.css';

export const TimesheetPage = () => {
  const dispatch = useDispatch();

  // Хуки всегда идут в начале
  const employee = useSelector(selectProfile);
  const shifts = useSelector(selectShifts);

  // 1. Загрузка данных
  useEffect(() => {
    dispatch(getShifts());
  }, []);

  // 2. Очистка при уходе со страницы
  useEffect(() => {
    return () => {
      dispatch(clearShifts()); // Гарантированно сбросит в null
    };
  }, []);

  // Проверка профиля — только после хуков!
  if (employee === null) {
    return null;
  }

  return (
    <>
      <div className={styles.manager}>
        <InfoBlock
          title='Структурное подразделение'
          text={`УУМ ${employee.profileWorkshopCode}`}
        />
        <InfoBlock title='№ бригады' text={`${employee.profileTeamNumber}`} />
        <InfoBlock
          title='Руководитель'
          text={`${employee.lastName} ${employee.firstName} ${employee.patronymic}`}
        />
        <InfoBlock
          title='Должность'
          text={employee.profileProfessionName || ''}
        />
      </div>

      {/* 1. Если данные загружены (не null) И список пуст — показываем заглушку */}
      {shifts !== null && shifts.length === 0 && (
        <p className={styles.empty}>Смен нет</p>
      )}

      {/* 2. Если данные загружены И есть элементы — показываем список */}
      {shifts !== null && shifts.length > 0 && <ShiftList shifts={shifts} />}
    </>
  );
};
