import { useContext, useEffect, useState } from 'react';

import { formatDateFormUI, formatDateForISO } from '../../../utils/utils';

import { IUpdateEmployee } from '../../../utils/api.interfaces';

import {
  GRADE_CODE_OPTIONS,
  PAYMENT_CODE_OPTIONS,
  SCHEDULE_CODE_OPTIONS,
  TEAM_CODE_OPTIONS,
} from '../../../utils/constants';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { useDispatch, useSelector } from '../../../services/store';

import { updateEmployee } from '../../../services/slices/employee/actions';

import {
  clearUpdateEmployeeError,
  selectSearсhEmployee,
  selectUpdateEmployeeError,
} from '../../../services/slices/employee/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { ServerError } from '../../ui/server-error/server-error';
import { Switch } from '../../ui/switch/switch';

import { CheckboxInput } from '../../ui/inputs/checkbox-input/checkbox-input';
import { SelectInput } from '../../ui/inputs/select-input/select-input';
import { TextInput } from '../../ui/inputs/text-input/text-input';

import styles from './employee-edit-form.module.css';

interface IFormData extends Record<string, string> {
  profileTeamNumber: string;
  profilePositionCode: string;
  profileGradeCode: string;
  profileScheduleCode: string;
  profilePaymentCode: string;

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
  endDate: string;
}

export const EmployeeEditForm = () => {
  const { isEmployeeEditOpen, setIsOverlayOpen, setIsEmployeeEditOpen } =
    useContext(LayerContext);

  const dispatch = useDispatch();
  const employee = useSelector(selectSearсhEmployee);
  const serverError = useSelector(selectUpdateEmployeeError);

  if (!employee) {
    return null;
  }

  const [isShow, setIsShow] = useState(false);
  const [hasAccess, setHasAccess] = useState(employee.hasAccess);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    profileTeamNumber: String(employee.profileTeamNumber),
    profilePositionCode: String(employee.profilePositionCode),
    profileGradeCode: String(employee.profileGradeCode),
    profileScheduleCode: employee.profileScheduleCode,
    profilePaymentCode: employee.profilePaymentCode,

    lastName: employee.lastName,
    firstName: employee.firstName,
    patronymic: employee.patronymic,
    personalNumber: String(employee.personalNumber),
    teamNumber: String(employee.teamNumber),
    positionCode: String(employee.positionCode),
    gradeCode: String(employee.gradeCode),
    scheduleCode: employee.scheduleCode,
    paymentCode: employee.paymentCode,
    birthDay: formatDateFormUI(employee.birthDay),
    startDate: formatDateFormUI(employee.startDate),
    endDate: formatDateFormUI(employee.endDate),
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    profileTeamNumber: '',
    profilePositionCode: '',
    profileGradeCode: '',
    profileScheduleCode: '',
    profilePaymentCode: '',

    hasAccess: '',

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
    const dataForBackend: IUpdateEmployee = {
      id: employee.id,

      profileTeamNumber: Number(formData.profileTeamNumber),
      profilePositionCode: Number(formData.profilePositionCode),
      profileGradeCode: Number(formData.profileGradeCode),
      profileScheduleCode: formData.profileScheduleCode,
      profilePaymentCode: formData.profilePaymentCode,

      hasAccess: hasAccess,

      lastName: formData.lastName,
      firstName: formData.firstName,
      patronymic: formData.patronymic,
      personalNumber: Number(formData.personalNumber),
      teamNumber: Number(formData.teamNumber),
      positionCode: Number(formData.positionCode),
      gradeCode: Number(formData.gradeCode),
      scheduleCode: formData.scheduleCode,
      paymentCode: formData.paymentCode,

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
        profileTeamNumber: '',
        profilePositionCode: '',
        profileGradeCode: '',
        profileScheduleCode: '',
        profilePaymentCode: '',

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
        endDate: '',
      });

      setErrors({
        profileTeamNumber: '',
        profilePositionCode: '',
        profileGradeCode: '',
        profileScheduleCode: '',
        profilePaymentCode: '',

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
        endDate: '',
      });
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled =
    Object.values(errors).some(Boolean) ||
    !formData.profileTeamNumber ||
    !formData.profilePositionCode ||
    !formData.profileGradeCode ||
    !formData.profileScheduleCode ||
    !formData.profilePaymentCode ||
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
      title='Личный кабинет'
      onSubmit={handleSubmit}
      className={styles.container}
    >
      <SelectInput
        name='profileTeamNumber'
        value={formData.profileTeamNumber}
        label='Бригада №'
        options={TEAM_CODE_OPTIONS}
        className={styles.input}
        error={errors.profileTeamNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='profilePositionCode'
        label='Штатная позиция'
        placeholder='123456'
        value={formData.profilePositionCode}
        error={errors.profilePositionCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='profileGradeCode'
        label='Разряд'
        value={formData.profileGradeCode}
        options={GRADE_CODE_OPTIONS}
        error={errors.profileGradeCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='profileScheduleCode'
        label='График работы'
        value={formData.profileScheduleCode}
        options={SCHEDULE_CODE_OPTIONS}
        error={errors.profileScheduleCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='profilePaymentCode'
        label='Система оплаты'
        value={formData.profilePaymentCode}
        options={PAYMENT_CODE_OPTIONS}
        error={errors.profilePaymentCode}
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
            placeholder='Иванов'
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
            placeholder='Иван'
            value={formData.firstName}
            error={errors.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='patronymic'
            label='Отчество'
            placeholder='Иванович'
            value={formData.patronymic}
            error={errors.patronymic}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='personalNumber'
            label='Личный №'
            placeholder='12345'
            value={formData.personalNumber}
            error={errors.personalNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='teamNumber'
            label='Бригада №'
            value={formData.teamNumber}
            options={TEAM_CODE_OPTIONS}
            error={errors.teamNumber}
            onChange={handleChange}
            onBlur={handleBlur}
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
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='scheduleCode'
            label='График работы'
            value={formData.scheduleCode}
            options={SCHEDULE_CODE_OPTIONS}
            error={errors.scheduleCode}
            onChange={handleChange}
            onBlur={handleBlur}
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
