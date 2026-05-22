import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatDateForISO } from '../../../utils/utils';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { useDispatch, useSelector } from '../../../services/store';

import { createEmployee } from '../../../services/slices/employee/actions';

import {
  clearCreateEmployeeError,
  selectCreateEmployeeError,
  selectIsCreateEmployeeLoading,
} from '../../../services/slices/employee/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { ServerError } from '../../ui/errors/server-error/server-error';
import { Spinner } from '../../ui/spinner/spinner';
import { TextInput } from '../../ui/inputs/text-input/text-input';

import styles from './employee-create-form.module.css';
import { ICreateEmployee } from '../../../utils/api.interface';

interface IFormData extends Record<string, string> {
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  position: string;
  birthDay: string;
  startDate: string;
}

export const EmployeeCreateForm = () => {
  const navigate = useNavigate();

  const {
    isEmployeeCreateOpen,
    setIsEmployeeCreateOpen,
    setIsAccountInfoOpen,
  } = useContext(LayerContext);

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsCreateEmployeeLoading);
  const serverError = useSelector(selectCreateEmployeeError);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    lastName: '',
    firstName: '',
    patronymic: '',
    personalNumber: '',
    teamNumber: '',
    position: '',
    birthDay: '',
    startDate: '',
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
  });

  useEffect(() => {
    if (isEmployeeCreateOpen) {
      dispatch(clearCreateEmployeeError());
    }
  }, [isEmployeeCreateOpen]);

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
    dispatch(clearCreateEmployeeError());
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

    // Преобразование данных перед отправкой
    const dataForBackend: ICreateEmployee = {
      lastName: formData.lastName,
      firstName: formData.firstName,
      patronymic: formData.patronymic,
      personalNumber: formData.personalNumber,
      teamNumber: formData.teamNumber,
      positionCode: formData.position,
      birthDay: formatDateForISO(formData.birthDay),
      startDate: formatDateForISO(formData.startDate),
    };

    try {
      await dispatch(createEmployee(dataForBackend)).unwrap();

      navigate('/admin');

      setIsEmployeeCreateOpen(false);
      setIsAccountInfoOpen(true);

      setFormData({
        lastName: '',
        firstName: '',
        patronymic: '',
        personalNumber: '',
        teamNumber: '',
        position: '',
        birthDay: '',
        startDate: '',
      });

      setErrors({
        lastName: '',
        firstName: '',
        patronymic: '',
        personalNumber: '',
        teamNumber: '',
        position: '',
        birthDay: '',
        startDate: '',
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
    !formData.position ||
    !formData.birthDay ||
    !formData.startDate;

  return (
    <Form
      title='Новый работник'
      className={styles.container}
      onSubmit={handleSubmit}
    >
      <TextInput
        // Группа 1. Стандартные HTML‑атрибуты (базовые свойства элемента)
        type='text'
        name='lastName'
        value={formData.lastName}
        // Группа 2. Кастомные пропсы компонента (специфичные для TextInput)
        label='Фамилия'
        error={errors.lastName}
        className={styles.input}
        // Группа 3. Обработчики событий (в конце)
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='firstName'
        value={formData.firstName}
        label='Имя'
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
        value={formData.personalNumber}
        label='Личный номер'
        error={errors.personalNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='teamNumber'
        value={formData.teamNumber}
        label='Бригада'
        error={errors.teamNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='position'
        value={formData.position}
        label='Штатная позиция'
        error={errors.position}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='birthDay'
        placeholder='дд.мм.гггг'
        value={formData.birthDay}
        label='Дата рождения'
        error={errors.birthDay}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='startDate'
        placeholder='дд.мм.гггг'
        value={formData.startDate}
        label='Дата назначения'
        error={errors.startDate}
        onChange={handleChange}
        onBlur={handleBlur}
      />

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
