import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { formatDateForInput } from '../../../utils/utils';

import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './employee-edit-form.module.css';
import { selectSearсhEmployee } from '../../../services/slices/employee/slice';

interface IFormData extends Record<string, string> {
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  position: string;
  birthDay: string;
  startDate: string;
  endDate: string;
  role: string;
}

export const EmployeeEditForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const employee = useSelector(selectSearсhEmployee);
  const isLoading = true;
  const serverError = '';

  if (!employee) {
    return;
  }

  const { isLoginOpen, setIsOverlayOpen, setIsLoginOpen } =
    useContext(LayerContext);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    lastName: employee.lastName,
    firstName: employee.firstName,
    patronymic: employee.patronymic,
    personalNumber: employee.personalNumber,
    teamNumber: employee.team,
    position: employee.positionCode,
    birthDay: formatDateForInput(employee.birthDay),
    startDate: formatDateForInput(employee.startDate),
    endDate: formatDateForInput(employee.endDate),
    role: employee.role || 'Не назначена',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    lastName: '',
    firstName: '',
    patronymic: '',
    personalNumber: '',
    teamNumber: '',
    position: '',
    birthDay: '',
    startDate: '',
    endDate: '',
    role: '',
  });

  useEffect(() => {
    if (isLoginOpen) {
      // dispatch(clearError());
    }
  }, [isLoginOpen]);

  // Обработчик изменения поля ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // dispatch(clearError());
  };

  // Обработчик потери фокуса для валидации
  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
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

   
    //   try {
    //     const employee = await dispatch(loginEmployee(formData)).unwrap();
    //     const targetPage = ROLE_TO_PAGE[employee.role || '/'];

    //     navigate(targetPage);

    //     setIsLoginOpen(false);
    //     setIsOverlayOpen(false);

    //     setFormData({ login: '', password: '' });
    //     setErrors({ login: '', password: '' });
    //   } catch (error) {
    //     throw new Error();
    //   }

  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading || !formData.login || !formData.password;

  return (
    <Form title='Профиль' onSubmit={handleSubmit}>
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
        name='position'
        label='Штатная позиция'
        value={formData.position}
        error={errors.position}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='date'
        name='birthDay'
        label='Дата рождения'
        value={formData.birthDay}
        error={errors.birthDay}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='date'
        name='startDate'
        label='Дата назначения'
        value={formData.startDate}
        error={errors.startDate}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='date'
        name='endDate'
        label='Дата увольнения'
        value={formData.endDate}
        error={errors.endDate}
        onChange={handleChange}
        onBlur={handleBlur}
      />

       <TextInput
        type='text'
        name='role'
        label='Роль'
        value={formData.role}
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
        label='Сохранить'
        disabled={isButtonDisabled}
        className={styles.button}
      />
    </Form>
  );
};
