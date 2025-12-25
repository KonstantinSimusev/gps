import styles from './add-worker.form.module.css';

import { useContext, useEffect, useState } from 'react';

import { Spinner } from '../../spinner/spinner';

import { useDispatch, useSelector } from '../../../services/store';
import {
  selectError,
  selectIsLoadingUserShift,
  clearError,
} from '../../../services/slices/user-shift/slice';
import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';
import { createUserShift } from '../../../services/slices/user-shift/actions';
import { selectLastShift } from '../../../services/slices/shift/slice';
import { getLastTeamShift } from '../../../services/slices/shift/actions';
import { IUserShift } from '../../../utils/api.interface';

// Изменим тип IFormData на Record<string, string>
interface IFormData extends Record<string, string> {
  personalNumber: string;
}

export const AddWorkerForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoadingUserShift);
  const lastShift = useSelector(selectLastShift);
  const error = useSelector(selectError);

  const {
    isAddWorkerOpenModall,
    setIsAddWorkerOpenModall,
    setIsUserShiftInfoOpenModal,
    setSelectedUser,
  } = useContext(LayerContext);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    personalNumber: '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    personalNumber: '',
    currentShift: '',
  });

  useEffect(() => {
    if (isAddWorkerOpenModall) {
      dispatch(clearError());
    }
  }, [isAddWorkerOpenModall, dispatch]);

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
    dispatch(clearError());
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

    // Если форма валидна, можно отправить данные на сервер
    if (Object.keys(formErrors).length === 0) {
      try {
        const payload = {
          personalNumber: Number(formData.personalNumber),
          shiftId: lastShift?.id ?? '',
        };

        const response = await dispatch(createUserShift(payload));

        if (response.payload) {
          const userShift = response.payload as IUserShift;

          if (userShift.user) {
            setSelectedUser(userShift.user);
          }

          setIsAddWorkerOpenModall(false);
          setIsUserShiftInfoOpenModal(true);

          setFormData({ personalNumber: '' });
          setErrors({ personalNumber: '', currentShift: '' });

          dispatch(getLastTeamShift());
        } else {
          setFormData({ personalNumber: '' });
          throw new Error();
        }
      } catch (error) {
        // dispatch(clearError())
        throw new Error();
      }
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading || !formData.personalNumber;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Новый работник</h3>
      <form className={styles.form__worker} onSubmit={handleSubmit}>
        <label className={styles.input__name}>Личный номер</label>
        <input
          className={styles.input__worker}
          type='text'
          name='personalNumber'
          value={formData.personalNumber}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className={styles.errors}>
          {errors.personalNumber && (
            <span className={styles.error}>{errors.personalNumber}</span>
          )}
        </div>

        <div className={styles.spinner}>{isLoading && <Spinner />}</div>
        {<div className={styles.errors__server}>{error}</div>}

        <button
          type='submit'
          className={styles.button__worker}
          disabled={isButtonDisabled}
          style={{
            opacity: isButtonDisabled ? 0.4 : 0.9,
          }}
        >
          Добавить
        </button>
      </form>
    </div>
  );
};
