import { useContext, useEffect, useState } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';
import { useDispatch, useSelector } from '../../../services/store';

import { createEmployee } from '../../../services/slices/employee/actions';

import {
  selectIsCreateEmployeeLoading,
  selectCreateEmployeeError,
  clearCreateEmployeeError,
} from '../../../services/slices/employee/slice';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './employee-create-form.module.css';

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

    const data = {
      lastName: formData.lastName,
      firstName: formData.firstName,
      patronymic: formData.patronymic,
      personalNumber: formData.personalNumber,
      teamNumber: formData.teamNumber,
      positionCode: formData.position,
      birthDay: formData.birthDay,
      startDate: formData.startDate,
    };

    try {
      await dispatch(createEmployee(data)).unwrap();

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
      onSubmit={handleSubmit}
      className={styles.container}
    >
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
