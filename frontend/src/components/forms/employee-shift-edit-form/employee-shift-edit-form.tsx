import { useContext, useEffect, useState } from 'react';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import {
  parseHoursMinutesToMinutes,
  parseMinutesToHoursMinutes,
} from '../../../utils/utils';

import {
  ATTENDANCE_OPTIONS,
  PRESENT_OPTIONS,
  WORK_PLACES_OPTIONS,
  PAYMENT_CODE_OPTIONS,
  POSITION_OPTIONS,
} from '../../../utils/constants';

import { IUpdateEmployeeShift } from '../../../utils/api.interfaces';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch, useSelector } from '../../../services/store';

import { updateEmployeeShift } from '../../../services/slices/employee-shift/actions';
import { getShiftById } from '../../../services/slices/shift/actions';

import {
  clearUpdateEmployeeShift,
  selectUpdateEmployeeShiftError,
} from '../../../services/slices/employee-shift/slice';

import { selectShift } from '../../../services/slices/shift/slice';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { SelectInput } from '../../ui/inputs/select-input/select-input';
import { ServerError } from '../../ui/server-error/server-error';
import { TextInput } from '../../ui/inputs/text-input/text-input';

import styles from './employee-shift-edit-form.module.css';

interface IFormData extends Record<string, string> {
  currentPositionCode: string;
  currentPaymentCode: string;
  attendanceCode: string;
  hours: string;
  minutes: string;
  isPresent: string;
  workplaceName: string;

  // Распоряжение
  // documentTitleCode: string;
  // documentReasonCode: string;
  // documentActionCode: string;
  // documentPaymentCode: string;
  // documentStartDate: string;
  // documentEndDate: string;
  // documentAbsentEmpNumber: string;
}

export const EmployeeShiftEditForm = () => {
  const {
    isEmployeeShiftEditOpen,
    setIsOverlayOpen,
    setIsEmployeeShiftEditOpen,
    selectedId, // это employeeShiftId
  } = useContext(LayerContext);

  const dispatch = useDispatch();
  const shift = useSelector(selectShift);
  const serverError = useSelector(selectUpdateEmployeeShiftError);

  if (!shift) {
    return;
  }

  // Находим employeeShift по ID
  const employeeShift = shift.employeeShifts.find((es) => es.id === selectedId);

  if (!employeeShift) {
    return;
  }

  const employee = employeeShift.employee;

  const matchedOption = POSITION_OPTIONS.find(
    (opt) => opt.value === String(employeeShift.currentPositionCode),
  );

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    currentPositionCode: matchedOption?.value ?? '',
    currentPaymentCode: employeeShift.currentPaymentCode,
    attendanceCode: employeeShift.attendanceCode,
    hours: String(parseMinutesToHoursMinutes(employeeShift.minutes).hours),
    minutes: String(parseMinutesToHoursMinutes(employeeShift.minutes).minutes),

    isPresent:
      employeeShift?.isPresent === true
        ? 'true'
        : employeeShift?.isPresent === false
          ? 'false'
          : '',

    workplaceName: employeeShift?.workplaceName ?? '',

    // Распоряжение
    // documentTitleCode: employeeShift?.documentTitleCode ?? '',
    // documentReasonCode: employeeShift?.documentReasonCode ?? '',
    // documentActionCode: employeeShift?.documentActionCode ?? '',
    // documentPaymentCode: employeeShift?.documentPaymentCode ?? '',
    // documentStartDate: formatDateFormUI(employeeShift?.documentStartDate),
    // documentEndDate: formatDateFormUI(employeeShift?.documentEndDate),
    // documentAbsentEmpNumber: employeeShift?.documentTitleCode ?? '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    currentPositionCode: '',
    currentPaymentCode: '',
    attendanceCode: '',
    hours: '',
    minutes: '',
    isPresent: '',
    workplaceName: '',

    // распоряжение
    // documentTitleCode: '',
    // documentReasonCode: '',
    // documentActionCode: '',
    // documentPaymentCode: '',
    // documentStartDate: '',
    // documentEndDate: '',
    // documentAbsentEmpNumber: '',
  });

  useEffect(() => {
    if (isEmployeeShiftEditOpen) {
      dispatch(clearUpdateEmployeeShift());
    }
  }, [isEmployeeShiftEditOpen]);

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
    dispatch(clearUpdateEmployeeShift());
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
    const data: IUpdateEmployeeShift = {
      employeeShiftId: employeeShift.id,
      shiftId: shift.id,
      employeeId: employeeShift.employee.id,

      currentPositionCode: Number(formData.currentPositionCode), // берем из распоряжения, если нет из КЛС
      currentPaymentCode: formData.currentPaymentCode, // берем из распоряжения, если нет из КЛС
      attendanceCode: formData.attendanceCode,

      minutes: parseHoursMinutesToMinutes(
        Number(formData.hours),
        Number(formData.minutes),
      ),

      isPresent:
        formData.isPresent === ''
          ? null
          : formData.isPresent === 'true'
            ? true
            : false,

      workplaceName:
        formData.workplaceName === '' ? null : formData.workplaceName,

      // Распоряжение
      // documentTitleCode:
      //   formData.documentTitleCode === '' ? null : formData.documentTitleCode,

      // documentReasonCode:
      //   formData.documentReasonCode === '' ? null : formData.documentReasonCode,

      // documentActionCode:
      //   formData.documentActionCode === '' ? null : formData.documentActionCode,

      // documentPaymentCode:
      //   formData.documentPaymentCode === ''
      //     ? null
      //     : formData.documentPaymentCode,

      // documentStartDate:
      //   formData.documentStartDate === ''
      //     ? null
      //     : formatDateForISO(formData.documentStartDate),

      // documentEndDate:
      //   formData.documentEndDate === ''
      //     ? null
      //     : formatDateForISO(formData.documentEndDate),

      // documentAbsentEmpNumber:
      //   formData.documentAbsentEmpNumber === ''
      //     ? null
      //     : Number(formData.documentAbsentEmpNumber),
    };

    try {
      await dispatch(updateEmployeeShift(data)).unwrap();
      dispatch(getShiftById(shift.id));

      setIsEmployeeShiftEditOpen(false);
      setIsOverlayOpen(false);

      setFormData({
        currentPositionCode: '',
        currentPaymentCode: '',
        attendanceCode: '',
        hours: '',
        minutes: '',
        isPresent: '',
        workplaceName: '',

        // распоряжение
        // documentTitleCode: '',
        // documentReasonCode: '',
        // documentActionCode: '',
        // documentPaymentCode: '',
        // documentStartDate: '',
        // documentEndDate: '',
        // documentAbsentEmpNumber: '',
      });

      setErrors({
        currentPositionCode: '',
        currentPaymentCode: '',
        attendanceCode: '',
        hours: '',
        minutes: '',
        isPresent: '',
        workplaceName: '',

        // распоряжение
        // documentTitleCode: '',
        // documentReasonCode: '',
        // documentActionCode: '',
        // documentPaymentCode: '',
        // documentStartDate: '',
        // documentEndDate: '',
        // documentAbsentEmpNumber: '',
      });
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }
  };

  // const isCreateDocument =
  //   (shift.shiftCode === null &&
  //     shift.scheduleCode === SCHEDULE.S_5B1 &&
  //     parseHoursMinutesToMinutes(
  //       Number(formData.hours),
  //       Number(formData.minutes),
  //     ) > 0) ||
  //   shift.workshopCode !== employeeShift.employee.workshopCode ||
  //   shift.teamNumber !== employeeShift.employee.teamNumber ||
  //   employeeShift.currentPositionCode !==
  //     Number(formData.currentPositionCode) ||
  //   employeeShift.currentPaymentCode !== formData.currentPaymentCode;

  const isButtonDisabled =
    Object.values(errors).some(Boolean) ||
    !formData.currentPositionCode ||
    !formData.currentPaymentCode ||
    !formData.attendanceCode ||
    !formData.hours ||
    !formData.minutes;

  return (
    <Form
      title={`${employee.lastName} ${employee.firstName} ${employee.patronymic}`}
      onSubmit={handleSubmit}
      className={styles.container}
    >
      <SelectInput
        name='currentPositionCode'
        label='Штатная позиция в смене'
        value={formData.currentPositionCode}
        options={POSITION_OPTIONS}
        className={styles.input}
        error={errors.currentPositionCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='currentPaymentCode'
        label='Система оплаты в смене'
        value={formData.currentPaymentCode}
        options={PAYMENT_CODE_OPTIONS}
        error={errors.currentPaymentCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='attendanceCode'
        label='Статус работы'
        value={formData.attendanceCode}
        options={ATTENDANCE_OPTIONS}
        error={errors.attendanceCode}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='hours'
        label='Отработано часов'
        value={formData.hours}
        placeholder='12'
        error={errors.hours}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextInput
        type='text'
        name='minutes'
        label='Отработано минут'
        value={formData.minutes}
        placeholder='59'
        error={errors.minutes}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='isPresent'
        label='Сменно-встречное собрание'
        value={formData.isPresent}
        options={PRESENT_OPTIONS}
        error={errors.isPresent}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <SelectInput
        name='workplaceName'
        label='Рабочее место'
        value={formData.workplaceName}
        options={WORK_PLACES_OPTIONS}
        error={errors.workplaceName}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {/* {isCreateDocument && (
        <>
          <p className={styles.document}>Создайте распоряжение</p>

          <SelectInput
            name='documentTitleCode'
            label='Заголовок'
            value={formData.documentTitleCode}
            options={DOCUMENT_TITLE_OPTIONS}
            error={errors.documentTitleCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='documentReasonCode'
            label='Причина'
            value={formData.documentReasonCode}
            options={DOCUMENT_REASON_OPTIONS}
            error={errors.documentReasonCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='documentActionCode'
            label='Действие'
            value={formData.documentActionCode}
            options={DOCUMENT_ACTION_OPTIONS}
            error={errors.documentActionCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <SelectInput
            name='documentPaymentCode'
            label='Вид доплаты'
            value={formData.documentPaymentCode}
            options={DOCUMENT_PAYMENT_OPTIONS}
            error={errors.documentPaymentCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='documentStartDate'
            placeholder='дд.мм.гггг'
            value={formData.documentStartDate}
            label='Перевести с'
            error={errors.documentStartDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='documentEndDate'
            placeholder='дд.мм.гггг'
            value={formData.documentEndDate}
            label='Перевести по'
            error={errors.documentEndDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            type='text'
            name='documentAbsentEmpNumber'
            label='Личный номер отсутствующего'
            placeholder='12345'
            value={formData.documentAbsentEmpNumber}
            error={errors.documentAbsentEmpNumber}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </>
      )} */}

      {/* <SelectCustInput
          type='text'
          name='currentProfessionCode'
          label='Профессия в смене'
          value={formData.currentProfessionCode}
          options={PROFESSION_OPTIONS}
          error={errors.currentProfessionCode}
          onChange={handleChange}
          onBlur={handleBlur}
        /> */}

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
