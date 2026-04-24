import { useContext, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { updateEmployee } from '../../../services/slices/employee/actions';

import {
  clearUpdateEmployeeError,
  selectIsUpdateEmployeeLoading,
  selectSearсhEmployee,
  selectUpdateEmployeeError,
} from '../../../services/slices/employee/slice';

import { IUpdateEmployee } from '../../../utils/api.interface';
import { ROLE_OPTIONS } from '../../../utils/types';
import { formatDateForInput } from '../../../utils/utils';

import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { SelectInput } from '../../ui/inputs/select-input/select-input';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './employee-edit-form.module.css';

interface IFormData extends Record<string, string> {
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;
  birthDay: string;
  startDate: string;
  endDate: string;
  role: string;
}

export const EmployeeEditForm = () => {
  const { isEmployeeEditOpen, setIsOverlayOpen, setIsEmployeeEditOpen } =
    useContext(LayerContext);

  const dispatch = useDispatch();
  const employee = useSelector(selectSearсhEmployee);
  const isLoading = useSelector(selectIsUpdateEmployeeLoading);
  const serverError = useSelector(selectUpdateEmployeeError);

  if (!employee) {
    return;
  }

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    lastName: employee.lastName,
    firstName: employee.firstName,
    patronymic: employee.patronymic,
    personalNumber: employee.personalNumber,
    teamNumber: employee.team,
    positionCode: employee.positionCode,
    birthDay: formatDateForInput(employee.birthDay),
    startDate: formatDateForInput(employee.startDate),
    endDate: formatDateForInput(employee.endDate),
    role: employee.role || '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    lastName: '',
    firstName: '',
    patronymic: '',
    personalNumber: '',
    teamNumber: '',
    positionCode: '',
    birthDay: '',
    startDate: '',
    endDate: '',
    role: '',
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
      lastName: formData.lastName,
      firstName: formData.firstName,
      patronymic: formData.patronymic,
      personalNumber: formData.personalNumber,
      teamNumber: formData.teamNumber,
      positionCode: formData.positionCode,

      // Преобразование строк в Date
      birthDay: new Date(formData.birthDay),
      startDate: new Date(formData.startDate),

      // endDate: если пустая строка — null, иначе Date
      endDate: formData.endDate === '' ? null : new Date(formData.endDate),

      role: formData.role === '' ? null : formData.role,
    };

    const payload = {
      id: employee.id,
      data: dataForBackend,
    };

    try {
      await dispatch(updateEmployee(payload)).unwrap();

      setIsEmployeeEditOpen(false);
      setIsOverlayOpen(false);

      setFormData({
        lastName: '',
        firstName: '',
        patronymic: '',
        personalNumber: '',
        teamNumber: '',
        positionCode: '',
        birthDay: '',
        startDate: '',
        endDate: '',
        role: '',
      });

      setErrors({
        lastName: '',
        firstName: '',
        patronymic: '',
        personalNumber: '',
        teamNumber: '',
        positionCode: '',
        birthDay: '',
        startDate: '',
        endDate: '',
        role: '',
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
    !formData.birthDay ||
    !formData.startDate;

  return (
    <Form title='Профиль' onSubmit={handleSubmit} className={styles.container}>
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
        label='Личный номер'
        value={formData.personalNumber}
        error={errors.personalNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='teamNumber'
        label='Бригада'
        value={formData.teamNumber}
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

      <TextInput
        type='text'
        name='birthDay'
        label='Дата рождения'
        value={formData.birthDay}
        placeholder='гггг-мм-дд'
        error={errors.birthDay}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='startDate'
        label='Дата назначения'
        value={formData.startDate}
        placeholder='гггг-мм-дд'
        error={errors.startDate}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='endDate'
        label='Дата увольнения'
        value={formData.endDate}
        placeholder='гггг-мм-дд'
        error={errors.endDate}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='role'
        label='Роль'
        value={formData.role}
        placeholder='Не назначена'
        options={ROLE_OPTIONS}
        error={errors.role}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Spinner
        isLoading={isLoading}
        serverError={serverError}
        className={styles.spinner}
      />

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
