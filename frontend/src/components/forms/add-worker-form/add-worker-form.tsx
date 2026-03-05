import { useContext, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  createUserShift,
  getUsersShifts,
} from '../../../services/slices/user-shift/actions';

import {
  selectError,
  selectIsLoadingUserShift,
  clearError,
} from '../../../services/slices/user-shift/slice';

import { selectLastShift } from '../../../services/slices/shift/slice';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { IUserShift } from '../../../utils/api.interface';

import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './add-worker-form.module.css';

// Изменим тип IFormData на Record<string, string>
interface IFormData extends Record<string, string> {
  personalNumber: string;
}

export const AddWorkerForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoadingUserShift);
  const lastShift = useSelector(selectLastShift);
  const serverError = useSelector(selectError);

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
  }, []);

  // Обработчик изменения поля ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Оставляем только цифры (удаляем все нецифровые символы)
    const numericValue = value.replace(/\D/g, '');

    // Обновляем данные формы
    setFormData({
      ...formData,
      [name]: numericValue,
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
        if (lastShift) {
          const payload = {
            personalNumber: Number(formData.personalNumber),
            shiftId: lastShift.id,
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

            dispatch(getUsersShifts(lastShift.id));
          } else {
            setFormData({ personalNumber: '' });
            throw new Error();
          }
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
    <Form title='Новый работник' onSubmit={handleSubmit}>
      <TextInput
        type='text'
        name='personalNumber'
        label='Личный номер'
        value={formData.personalNumber}
        error={errors.personalNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        className={styles.input}
      />

      <Spinner
        isLoading={isLoading}
        serverError={serverError}
        className={styles.spinner}
      />

      <Button
        type='submit'
        label='Добавить'
        disabled={isButtonDisabled}
        className={styles.button}
      />
    </Form>
  );
};
