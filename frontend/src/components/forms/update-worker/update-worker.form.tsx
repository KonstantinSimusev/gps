import styles from './update-worker.form.module.css';

import { useContext, useEffect, useState } from 'react';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Spinner } from '../../spinner/spinner';
import { DownIcon } from '../../icons/down/down';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectUserShiftById,
  selectError,
  selectIsLoadingUserShift,
  clearError,
} from '../../../services/slices/user-shift/slice';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import {
  TEAM_PROFESSION_OPTIONS,
  TProfession,
  TWorkPlace,
  TWorkStatus,
  WORK_PLACE_OPTIONS,
  WORK_STATUS_OPTIONS,
} from '../../../utils/types';

import {
  getUsersShifts,
  updateUserShift,
} from '../../../services/slices/user-shift/actions';

import { selectCurrentShiftId } from '../../../services/slices/shift/slice';

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
  const shiftID = useSelector(selectCurrentShiftId);
  const isLoading = useSelector(selectIsLoadingUserShift);
  const error = useSelector(selectError);

  const userShift = useSelector((state) =>
    selectUserShiftById(state, selectedId),
  );

  if (!userShift?.user) {
    return null;
  }

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

          if (shiftID) {
            // если shiftID не null
            dispatch(getUsersShifts(shiftID)); // shiftID гарантированно string
          }
        }
      } catch (err) {
        // Обработка ошибок (можно расширить)
      }
    }
  };

  // const isButtonDisabled =
  //   isLoading ||
  //   formData.workPlace === empty ||
  //   (formData.workStatus === attendance && formData.workPlace === offline) ||
  //   (formData.workStatus === attendance && Number(formData.workHours) === 0) ||
  //   (formData.workStatus !== attendance && formData.workPlace !== offline) ||
  //   (formData.workPlace === offline && Number(formData.workHours) !== 0) ||
  // (formData.shiftProfession === packer &&
  //   !validPackerQueues.includes(formData.workPlace as TWorkPlace)) ||
  // (formData.shiftProfession === stacker &&
  //   !validStackerQueues.includes(formData.workPlace as TWorkPlace)) ||
  // (formData.shiftProfession === operator &&
  //   !validOperatorQueues.includes(formData.workPlace as TWorkPlace)) ||
  // (formData.shiftProfession === lumPacker &&
  //   !validLumPackerQueues.includes(formData.workPlace as TWorkPlace)) ||
  // (formData.shiftProfession === brigadir &&
  //   !validBrigadirQueues.includes(formData.workPlace as TWorkPlace)) ||
  // (formData.shiftProfession === driver &&
  //   !validDriverQuestions.includes(formData.workPlace as TWorkPlace)) ||
  // (formData.shiftProfession === cutter &&
  //   !validCutterQuestions.includes(formData.workPlace as TWorkPlace)) ||
  // (formData.shiftProfession !== operator &&
  //   formData.shiftProfession !== lumPacker &&
  //   Number(formData.workHours) > 11.5);

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
    <div className={styles.container}>
      <h3 className={styles.title}>
        <span>
          {userShift.user.lastName} {userShift.user.firstName}
        </span>
        <span>{userShift.user.patronymic}</span>
      </h3>
      <form className={styles.form__worker} onSubmit={handleSubmit}>
        <label className={styles.input__name}>Статус работы</label>
        <div className={styles.container__select}>
          <select
            className={styles.input__worker}
            name="workStatus"
            value={formData.workStatus}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {WORK_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <DownIcon />
        </div>
        <div className={styles.errors}>
          {errors.workStatus && (
            <span className={styles.error}>{errors.workStatus}</span>
          )}
        </div>

        <label className={styles.input__name}>Профессия в смене</label>
        <div className={styles.container__select}>
          <select
            className={styles.input__worker}
            name="shiftProfession"
            value={formData.shiftProfession}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {TEAM_PROFESSION_OPTIONS.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
          <DownIcon />
        </div>
        <div className={styles.errors}>
          {errors.shiftProfession && (
            <span className={styles.error}>{errors.shiftProfession}</span>
          )}
        </div>

        <label className={styles.input__name}>Рабочее место</label>
        <div className={styles.container__select}>
          <select
            className={styles.input__worker}
            name="workPlace"
            value={formData.workPlace}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              opacity: formData.workPlace === 'Не выбрано' ? 0.4 : 0.9,
            }}
          >
            {WORK_PLACE_OPTIONS.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
          <DownIcon />
        </div>
        <div className={styles.errors}>
          {errors.workPlace && (
            <span className={styles.error}>{errors.workPlace}</span>
          )}
        </div>

        <label className={styles.input__name}>Отработано часов</label>
        <input
          className={styles.input__worker}
          type="text"
          name="workHours"
          value={formData.workHours}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={clearWorkHoursField}
          placeholder="Введите часы"
        />
        <div className={styles.errors}>
          {errors.workHours && (
            <span className={styles.error}>{errors.workHours}</span>
          )}
        </div>

        <div className={styles.spinner}>{isLoading && <Spinner />}</div>
        {<div className={styles.errors__server}>{error}</div>}

        <button
          type="submit"
          className={styles.button__worker}
          disabled={isButtonDisabled}
          style={{
            opacity: isButtonDisabled ? 0.4 : 0.9,
          }}
        >
          Сохранить
        </button>
      </form>
    </div>
  );
};
