import { useContext, useEffect, useState } from 'react';

// import { IUpdateEmployee } from '../../../utils/api.interface';
import { ROLE_OPTIONS } from '../../../utils/types';
import { formatDateForUI } from '../../../utils/utils';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import {
  // useDispatch,
  useSelector,
} from '../../../services/store';

// import { updateEmployee } from '../../../services/slices/employee/actions';

import {
  // clearUpdateEmployeeError,
  selectIsUpdateEmployeeLoading,
  selectSearсhEmployee,
  selectUpdateEmployeeError,
} from '../../../services/slices/employee/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { ServerError } from '../../ui/errors/server-error/server-error';
import { SelectInput } from '../../ui/inputs/select-input/select-input';
import { Spinner } from '../../ui/spinner/spinner';

import styles from './timesheet-edit-form.module.css';

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

export const TimesheetEditForm = () => {
  const {
    isEmployeeAddOpen,
    selectedId,
    setIsOverlayOpen,
    setIsTimesheetEditOpen,
  } = useContext(LayerContext);

  // const dispatch = useDispatch();
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
    personalNumber: String(employee.personalNumber),
    teamNumber: String(employee.teamNumber),
    positionCode: String(employee.positionCode),
    birthDay: formatDateForUI(employee.birthDay),
    startDate: formatDateForUI(employee.startDate),
    endDate: formatDateForUI(employee.endDate || ''),
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
    if (isEmployeeAddOpen) {
      // dispatch(clearUpdateEmployeeError());
    }
  }, [isEmployeeAddOpen]);

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
    // dispatch(clearUpdateEmployeeError());
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
    // const dataForBackend: IUpdateEmployee = {
    //   lastName: formData.lastName,
    //   firstName: formData.firstName,
    //   patronymic: formData.patronymic,
    //   personalNumber: formData.personalNumber,
    //   teamNumber: formData.teamNumber,
    //   positionCode: formData.positionCode,

    //   // Преобразование строк в Date
    //   birthDay: new Date(formData.birthDay),
    //   startDate: new Date(formData.startDate),

    //   // endDate: если пустая строка — null, иначе Date
    //   endDate: formData.endDate === '' ? null : new Date(formData.endDate),

    //   role: formData.role === '' ? null : formData.role,
    // };

    // const payload = {
    //   id: employee.id,
    //   data: dataForBackend,
    // };

    try {
      // await dispatch(updateEmployee(payload)).unwrap();

      setIsTimesheetEditOpen(false);
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
    <Form
      title={selectedId}
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
