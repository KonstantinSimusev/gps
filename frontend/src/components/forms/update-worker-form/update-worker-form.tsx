import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  getUsersShifts,
  updateUserShift,
} from '../../../services/slices/user-shift/actions';

import {
  selectError,
  selectIsLoadingUserShift,
  clearError,
  selectUserShiftById,
} from '../../../services/slices/user-shift/slice';

import { selectLastShift } from '../../../services/slices/shift/slice';

import {
  TEAM_PROFESSION_OPTIONS,
  TProfession,
  TWorkPlace,
  TWorkStatus,
  WORK_PLACE_OPTIONS,
  WORK_STATUS_OPTIONS,
} from '../../../utils/types';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';
import { SelectInput } from '../../ui/inputs/select-input/select-input';

import styles from './update-worker-form.module.css';

// Изменим тип IFormData на Record<string, string>
interface IFormData extends Record<string, string> {
  workStatus: string;
  shiftProfession: string;
  workPlace: string;
  workHours: string;
}

export const UpdateWorkerForm = () => {
  const {
    selectedId,
    isUpdateWorkerOpenModall,
    setIsOpenOverlay,
    setIsUpdateWorkerOpenModall,
  } = useContext(LayerContext);

  const dispatch = useDispatch();

  const lastShift = useSelector(selectLastShift);

  if (!lastShift) {
    console.error('Не удалось получить смену');
    return;
  }

  const userShift = useSelector((state) =>
    selectUserShiftById(state, selectedId),
  );

  if (!userShift) {
    console.error('Не удалось получить смену работника');
    return;
  }

  const isLoading = useSelector(selectIsLoadingUserShift);
  const serverError = useSelector(selectError);

  const attendance: TWorkStatus = 'Явка';
  const offline: TWorkPlace = 'Не работает';
  const empty: TWorkPlace = 'Не выбрано';
  const position_1: TWorkPlace = '1 очередь';
  const position_2: TWorkPlace = '2 очередь';
  const position_3: TWorkPlace = '3 очередь';
  const team: TWorkPlace = 'Бригада по реквизитам';
  const lum: TWorkPlace = 'ЛУМ';

  const validPackerQueues: TWorkPlace[] = [position_1, position_2, position_3];
  const validStackerQueues: TWorkPlace[] = [position_1, position_2, position_3];
  const validOperatorQueues: TWorkPlace[] = [lum];
  const validLumPackerQueues: TWorkPlace[] = [lum];
  const validBrigadirQueues: TWorkPlace[] = [team];
  const validDriverQuestions: TWorkPlace[] = [team];
  const validCutterQuestions: TWorkPlace[] = [team];

  const packer: TProfession = 'Укладчик-упаковщик';
  const stacker: TProfession = 'Штабелировщик металла';
  const operator: TProfession = 'Оператор ПУ';
  const lumPacker: TProfession = 'Укладчик-упаковщик ЛУМ';
  const brigadir: TProfession = 'Бригадир ОСП';
  const driver: TProfession = 'Водитель погрузчика';
  const cutter: TProfession = 'Резчик холодного металла';

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    workStatus: userShift.workStatus,
    shiftProfession: userShift.shiftProfession,
    workPlace:
      userShift.workStatus === attendance ? userShift.workPlace : offline,
    workHours:
      userShift.workStatus === attendance ? String(userShift.workHours) : '0.0',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    workStatus: '',
    shiftProfession: '',
    workPlace: '',
    workHours: '',
  });

  useEffect(() => {
    if (isUpdateWorkerOpenModall) {
      dispatch(clearError());
    }
  }, [isUpdateWorkerOpenModall, dispatch]);

  // Единый обработчик изменений для всех полей
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    // Нормализация чисел для workHours
    if (name === 'workHours') {
      newValue = value.replace(/,/g, '.');
      if (!/^-?\d*\.?\d*$/.test(newValue) && newValue !== '') return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      // Логика для workStatus
      if (name === 'workStatus') {
        if (newValue !== attendance) {
          updated.workPlace = offline;
          updated.workHours = '0.0';
        } else if (prev.workPlace === offline) {
          updated.workPlace = WORK_PLACE_OPTIONS[0];
        }
      }

      // Логика для shiftProfession: установка workHours в зависимости от профессии
      if (name === 'shiftProfession') {
        // Если статус работы — "Явка", применяем правила по профессии
        if (updated.workStatus === 'Явка') {
          if (newValue === operator || newValue === lumPacker) {
            updated.workHours = '12';
          } else {
            updated.workHours = '11.5'; // Для всех остальных профессий
          }
        }
      }

      return updated;
    });

    // Сброс ошибок
    setErrors((prev) => ({
      ...prev,
      [name]: '',
      ...(name === 'workStatus' && { workPlace: '', workHours: '' }),
    }));

    dispatch(clearError());
  };

  // Валидация при потере фокуса
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value, validationRules);
    setErrors((prev) => ({ ...prev, [name]: error || '' }));
  };

  const clearWorkHoursField = () => {
    setFormData((prev) => ({
      ...prev,
      workHours: '',
    }));
    setErrors((prev) => ({
      ...prev,
      workHours: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm(formData, validationRules);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const payload = {
          id: userShift.id,
          workStatus: formData.workStatus,
          shiftProfession: formData.shiftProfession,
          workPlace: formData.workPlace,
          workHours: Number(formData.workHours),
        };

        const response = await dispatch(updateUserShift(payload));
        if (response.payload) {
          setIsUpdateWorkerOpenModall(false);
          setIsOpenOverlay(false);

          dispatch(getUsersShifts(lastShift.id));
        }
      } catch (err) {
        // Обработка ошибок (можно расширить)
      }
    }
  };

  const isButtonDisabled =
    isLoading ||
    // Общие ошибки валидации
    Object.keys(errors).some((key) => errors[key] !== '') ||
    // Правила для НЕ-явки (любой статус ≠ "Явка")
    (formData.workStatus !== attendance
      ? // Для не‑явки:
        formData.workPlace !== offline || // должно быть "Не работает"
        Number(formData.workHours) !== 0 // часы должны быть 0
      : // Правила для "Явки" (статус === "Явка"):
        formData.workPlace === empty || // место не выбрано
        formData.workPlace === offline || // при явке место не может быть "Не работает"
        Number(formData.workHours) === 0 || // часы не могут быть 0 при явке
        // Проверки соответствия профессии и места
        (formData.shiftProfession === packer &&
          !validPackerQueues.includes(formData.workPlace as TWorkPlace)) ||
        (formData.shiftProfession === stacker &&
          !validStackerQueues.includes(formData.workPlace as TWorkPlace)) ||
        (formData.shiftProfession === operator &&
          !validOperatorQueues.includes(formData.workPlace as TWorkPlace)) ||
        (formData.shiftProfession === lumPacker &&
          !validLumPackerQueues.includes(formData.workPlace as TWorkPlace)) ||
        (formData.shiftProfession === brigadir &&
          !validBrigadirQueues.includes(formData.workPlace as TWorkPlace)) ||
        (formData.shiftProfession === driver &&
          !validDriverQuestions.includes(formData.workPlace as TWorkPlace)) ||
        (formData.shiftProfession === cutter &&
          !validCutterQuestions.includes(formData.workPlace as TWorkPlace)) ||
        // Проверка часов для профессий
        (formData.shiftProfession !== operator &&
          formData.shiftProfession !== lumPacker &&
          Number(formData.workHours) > 11.5));

  return (
    <Form
      title={`${userShift.user?.lastName} ${userShift.user?.firstName} ${userShift.user?.patronymic}`}
      onSubmit={handleSubmit}
    >
      <SelectInput
        name='workStatus'
        label='Статус работы'
        value={formData.workStatus}
        error={errors.workStatus}
        onChange={handleChange}
        onBlur={handleBlur}
        options={WORK_STATUS_OPTIONS}
        className={styles.select}
      />

      <SelectInput
        name='shiftProfession'
        label='Профессия в смене'
        value={formData.shiftProfession}
        error={errors.shiftProfession}
        onChange={handleChange}
        onBlur={handleBlur}
        options={TEAM_PROFESSION_OPTIONS}
        className={styles.select_spacing}
      />

      <SelectInput
        name='workPlace'
        label='Рабочее место'
        value={formData.workPlace}
        error={errors.workPlace}
        onChange={handleChange}
        onBlur={handleBlur}
        options={WORK_PLACE_OPTIONS}
        className={styles.select_spacing}
      />

      <TextInput
        type='text'
        name='workHours'
        label='Отработано часов'
        value={formData.workHours}
        error={errors.workHours}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={clearWorkHoursField}
        placeholder='Введите часы'
      />

      <Spinner
        isLoading={isLoading}
        serverError={serverError}
        className={styles.spinner}
      />

      <Button
        type='submit'
        label='Сохранить'
        className={styles.button}
        disabled={isButtonDisabled}
      />
    </Form>
  );
};
