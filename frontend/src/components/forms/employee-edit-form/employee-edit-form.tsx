import { useContext, useEffect, useState } from 'react';

import { formatDateFormUI, formatDateForISO } from '../../../utils/utils';

import { IUpdateEmployee } from '../../../utils/api.interface';

import {
  GRADE_CODE_OPTIONS,
  SCHEDULE_CODE_OPTIONS,
  TEAM_CODE_OPTIONS,
} from '../../../utils/types';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { useDispatch, useSelector } from '../../../services/store';

import { updateEmployee } from '../../../services/slices/employee/actions';

import {
  clearUpdateEmployeeError,
  selectIsUpdateEmployeeLoading,
  selectSearсhEmployee,
  selectUpdateEmployeeError,
} from '../../../services/slices/employee/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { ServerError } from '../../ui/server-error/server-error';
import { Spinner } from '../../ui/spinner/spinner';
import { Switch } from '../../ui/switch/switch';

import { CheckboxInput } from '../../ui/inputs/checkbox-input/checkbox-input';
import { SelectInput } from '../../ui/inputs/select-input/select-input';
import { TextInput } from '../../ui/inputs/text-input/text-input';

import styles from './employee-edit-form.module.css';

interface IFormData extends Record<string, string> {
  currentTeamNumber: string;
  currentPositionCode: string;
  currentGradeCode: string;
  currentScheduleCode: string;

  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;
  gradeCode: string;
  scheduleCode: string;

  birthDay: string;
  startDate: string;
  endDate: string;
}

export const EmployeeEditForm = () => {
  const { isEmployeeEditOpen, setIsOverlayOpen, setIsEmployeeEditOpen } =
    useContext(LayerContext);

  const dispatch = useDispatch();
  const employee = useSelector(selectSearсhEmployee);
  const isLoading = useSelector(selectIsUpdateEmployeeLoading);
  const serverError = useSelector(selectUpdateEmployeeError);

  if (!employee) {
    return null;
  }

  const [isShow, setIsShow] = useState(false);
  const [hasAccess, setHasAccess] = useState(employee.hasAccess);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    currentTeamNumber: employee.currentTeamNumber || '',
    currentPositionCode: employee.currentPositionCode || '',
    currentGradeCode: employee.currentGradeCode || '',
    currentScheduleCode: employee.currentScheduleCode || '',

    lastName: employee.lastName,
    firstName: employee.firstName,
    patronymic: employee.patronymic,
    personalNumber: employee.personalNumber,
    teamNumber: employee.teamNumber,
    positionCode: employee.positionCode,
    gradeCode: employee.gradeCode,
    scheduleCode: employee.scheduleCode,

    birthDay: formatDateFormUI(employee.birthDay),
    startDate: formatDateFormUI(employee.startDate),
    endDate: formatDateFormUI(employee.endDate || ''),
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    currentTeamNumber: '',
    currentPositionCode: '',
    currentGradeCode: '',
    currentScheduleCode: '',

    hasAccess: '',

    lastName: '',
    firstName: '',
    patronymic: '',
    personalNumber: '',
    teamNumber: '',
    positionCode: '',
    gradeCode: '',
    scheduleCode: '',
    birthDay: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (isEmployeeEditOpen) {
      dispatch(clearUpdateEmployeeError());
    }
  }, [isEmployeeEditOpen]);

  // Обработчик изменения поля ввода
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Обновляем данные формы
    setFormData({
      ...formData,
      [name]: value,
    });

    // Сбрасываем ошибку при начале ввода
    setErrors({
      ...errors,
      [name]: '',
    });

    // Очищаем ошибки с сервера
    dispatch(clearUpdateEmployeeError());
  };

  // Обработчик потери фокуса для валидации
  const handleBlur = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Получаем ошибку валидации для поля
    const validationError = validateField(name, value, validationRules);

    // Обновляем состояние ошибок
    setErrors({
      ...errors,
      [name]: validationError || '',
    });
  };

  const handleAccessChange = (checked: boolean) => {
    setHasAccess(checked);

    // Сбрасываем ошибку для этого поля
    setErrors((prev) => ({
      ...prev,
      hasAccess: '',
    }));

    // Очищаем ошибки с сервера
    dispatch(clearUpdateEmployeeError());
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Валидируем всю форму
    const formErrors = validateForm(formData, validationRules);

    // Сохраняем все ошибки в состояние
    setErrors(formErrors);

    // Если форма невалидна, выход
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    // Преобразование данных перед отправкой
    const dataForBackend: IUpdateEmployee = {
      id: employee.id,

      currentTeamNumber:
        formData.currentTeamNumber === '' ? null : formData.currentTeamNumber,

      currentPositionCode:
        formData.currentPositionCode === ''
          ? null
          : formData.currentPositionCode,

      currentGradeCode:
        formData.currentGradeCode === '' ? null : formData.currentGradeCode,

      currentScheduleCode:
        formData.currentScheduleCode === ''
          ? null
          : formData.currentScheduleCode,

      hasAccess: hasAccess,

      lastName: formData.lastName,
      firstName: formData.firstName,
      patronymic: formData.patronymic,
      personalNumber: formData.personalNumber,
      teamNumber: formData.teamNumber,
      positionCode: formData.positionCode,
      gradeCode: formData.gradeCode,
      scheduleCode: formData.scheduleCode,

      // Преобразование строк в Date
      birthDay: formatDateForISO(formData.birthDay),
      startDate: formatDateForISO(formData.startDate),

      // endDate: если пустая строка — null, иначе Date
      endDate:
        formData.endDate === '' ? null : formatDateForISO(formData.endDate),
    };

    try {
      await dispatch(updateEmployee(dataForBackend)).unwrap();

      setIsEmployeeEditOpen(false);
      setIsOverlayOpen(false);

      setFormData({
        currentTeamNumber: '',
        currentPositionCode: '',
        currentGradeCode: '',
        currentScheduleCode: '',

        lastName: '',
        firstName: '',
        patronymic: '',
        personalNumber: '',
        teamNumber: '',
        positionCode: '',
        gradeCode: '',
        scheduleCode: '',
        birthDay: '',
        startDate: '',
        endDate: '',
      });

      setErrors({
        currentTeamNumber: '',
        currentPositionCode: '',
        currentGradeCode: '',
        currentScheduleCode: '',

        lastName: '',
        firstName: '',
        patronymic: '',
        personalNumber: '',
        teamNumber: '',
        positionCode: '',
        gradeCode: '',
        scheduleCode: '',
        birthDay: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled =
    isLoading ||
    Object.values(errors).some(Boolean) ||
    !formData.lastName ||
    !formData.firstName ||
    !formData.patronymic ||
    !formData.personalNumber ||
    !formData.teamNumber ||
    !formData.positionCode ||
    !formData.gradeCode ||
    !formData.scheduleCode ||
    !formData.birthDay ||
    !formData.startDate;

  return (
    <Form title='Профиль' onSubmit={handleSubmit} className={styles.container}>
      <SelectInput
        name='currentTeamNumber'
        value={formData.currentTeamNumber}
        label='Фактическая бригада №'
        isPlaceholder={formData.currentTeamNumber === ''}
        options={TEAM_CODE_OPTIONS}
        className={styles.input}
        error={errors.currentTeamNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='currentPositionCode'
        label='Фактическая штатная позиция'
        value={formData.currentPositionCode}
        error={errors.currentPositionCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='currentGradeCode'
        value={formData.currentGradeCode}
        label='Фактический разряд'
        isPlaceholder={formData.currentGradeCode === ''}
        options={GRADE_CODE_OPTIONS}
        error={errors.currentGradeCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='currentScheduleCode'
        value={formData.currentScheduleCode}
        label='Фактический график работы'
        isPlaceholder={formData.currentScheduleCode === ''}
        options={SCHEDULE_CODE_OPTIONS}
        error={errors.currentScheduleCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Switch
        label='Доступ в личный кабинет'
        checked={hasAccess}
        onChange={handleAccessChange}
        className={styles.switch}
      />

      <CheckboxInput
        text='Внести изменения в КЛС'
        checked={isShow}
        className={styles.input}
        onChange={(e) => setIsShow(e.target.checked)}
      />

      {isShow && (
        <>
          <TextInput
            type='text'
            name='lastName'
            label='Фамилия'
            value={formData.lastName}
            error={errors.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.input}
          />

          <TextInput
            type='text'
            name='firstName'
            label='Имя'
            value={formData.firstName}
            error={errors.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='patronymic'
            label='Отчество'
            value={formData.patronymic}
            error={errors.patronymic}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='personalNumber'
            label='Личный №'
            value={formData.personalNumber}
            error={errors.personalNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='teamNumber'
            value={formData.teamNumber}
            label='Бригада №'
            isPlaceholder={formData.teamNumber === ''}
            options={TEAM_CODE_OPTIONS}
            error={errors.teamNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='positionCode'
            label='Штатная позиция'
            value={formData.positionCode}
            error={errors.positionCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='gradeCode'
            value={formData.gradeCode}
            label='Разряд'
            isPlaceholder={formData.gradeCode === ''}
            options={GRADE_CODE_OPTIONS}
            error={errors.gradeCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='scheduleCode'
            value={formData.scheduleCode}
            label='График работы'
            isPlaceholder={formData.scheduleCode === ''}
            options={SCHEDULE_CODE_OPTIONS}
            error={errors.scheduleCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='birthDay'
            label='Дата рождения'
            value={formData.birthDay}
            placeholder='дд.мм.гггг'
            error={errors.birthDay}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='startDate'
            label='Дата назначения'
            value={formData.startDate}
            placeholder='дд.мм.гггг'
            error={errors.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='endDate'
            label='Дата увольнения'
            value={formData.endDate}
            placeholder='дд.мм.гггг'
            error={errors.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </>
      )}

      <div className={styles.message}>
        {isLoading ? <Spinner /> : <ServerError text={serverError} />}
      </div>

      <Button
        type='submit'
        disabled={isButtonDisabled}
        className={styles.button}
      >
        Сохранить
      </Button>
    </Form>
  );
};
