import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatDateForISO } from '../../../utils/utils';
import {
  GRADE_CODE_OPTIONS,
  PAYMENT_CODE_OPTIONS,
  SCHEDULE_CODE_OPTIONS,
  TEAM_CODE_OPTIONS,
} from '../../../utils/constants';
import { ICreateEmployee } from '../../../utils/api.interfaces';

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
} from '../../../services/slices/employee/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { ServerError } from '../../ui/server-error/server-error';
import { SelectInput } from '../../ui/inputs/select-input/select-input';
import { TextInput } from '../../ui/inputs/text-input/text-input';

import styles from './employee-create-form.module.css';

interface IFormData extends Record<string, string> {
  lastName: string;
  firstName: string;
  patronymic: string;
  personalNumber: string;
  teamNumber: string;
  positionCode: string;
  gradeCode: string;
  scheduleCode: string;
  paymentCode: string;
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
  const serverError = useSelector(selectCreateEmployeeError);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    lastName: '',
    firstName: '',
    patronymic: '',
    personalNumber: '',
    teamNumber: '',
    positionCode: '',
    gradeCode: '',
    scheduleCode: '',
    paymentCode: '',
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
    positionCode: '',
    gradeCode: '',
    scheduleCode: '',
    paymentCode: '',
    birthDay: '',
    startDate: '',
  });

  useEffect(() => {
    if (isEmployeeCreateOpen) {
      dispatch(clearCreateEmployeeError());
    }
  }, [isEmployeeCreateOpen]);

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
    dispatch(clearCreateEmployeeError());
  };

  // Обработчик потери фокуса для валидации
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      positionCode: formData.positionCode,
      gradeCode: formData.gradeCode,
      scheduleCode: formData.scheduleCode,
      paymentCode: formData.paymentCode,
      birthDay: formatDateForISO(formData.birthDay),
      startDate: formatDateForISO(formData.startDate),
    };

    try {
      await dispatch(createEmployee(dataForBackend)).unwrap();

      navigate('/employee');

      setIsEmployeeCreateOpen(false);
      setIsAccountInfoOpen(true);

      setFormData({
        lastName: '',
        firstName: '',
        patronymic: '',
        personalNumber: '',
        teamNumber: '',
        positionCode: '',
        gradeCode: '',
        scheduleCode: '',
        paymentCode: '',
        birthDay: '',
        startDate: '',
      });

      setErrors({
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
      });
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled =
    Object.values(errors).some(Boolean) ||
    !formData.lastName ||
    !formData.firstName ||
    !formData.patronymic ||
    !formData.personalNumber ||
    !formData.teamNumber ||
    !formData.positionCode ||
    !formData.gradeCode ||
    !formData.scheduleCode ||
    !formData.paymentCode ||
    !formData.birthDay ||
    !formData.startDate;

  return (
    <Form
      title='Новый работник'
      className={styles.container}
      onSubmit={handleSubmit}
    >
      <TextInput
        type='text'
        name='lastName'
        label='Фамилия'
        placeholder='Иванов'
        value={formData.lastName}
        error={errors.lastName}
        className={styles.input}
        onBlur={handleBlur}
        onChange={handleChange}
        autoFocus
      />

      <TextInput
        type='text'
        name='firstName'
        placeholder='Иван'
        label='Имя'
        value={formData.firstName}
        error={errors.firstName}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <TextInput
        type='text'
        name='patronymic'
        label='Отчество'
        placeholder='Иванович'
        value={formData.patronymic}
        error={errors.patronymic}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <TextInput
        type='text'
        name='personalNumber'
        label='Личный №'
        placeholder='12345'
        value={formData.personalNumber}
        error={errors.personalNumber}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <SelectInput
        name='teamNumber'
        label='Бригада №'
        value={formData.teamNumber}
        options={TEAM_CODE_OPTIONS}
        error={errors.teamNumber}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <TextInput
        type='text'
        name='positionCode'
        label='Штатная позиция'
        placeholder='123456'
        value={formData.positionCode}
        error={errors.positionCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='gradeCode'
        label='Разряд'
        value={formData.gradeCode}
        options={GRADE_CODE_OPTIONS}
        error={errors.gradeCode}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <SelectInput
        name='scheduleCode'
        label='График работы'
        value={formData.scheduleCode}
        options={SCHEDULE_CODE_OPTIONS}
        error={errors.scheduleCode}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <SelectInput
        name='paymentCode'
        label='Система оплаты'
        value={formData.paymentCode}
        options={PAYMENT_CODE_OPTIONS}
        error={errors.paymentCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='birthDay'
        label='Дата рождения'
        placeholder='дд.мм.гггг'
        value={formData.birthDay}
        error={errors.birthDay}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <TextInput
        type='text'
        name='startDate'
        label='Дата назначения'
        placeholder='дд.мм.гггг'
        value={formData.startDate}
        error={errors.startDate}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      <div className={styles.message}>
        <ServerError text={serverError} />
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
