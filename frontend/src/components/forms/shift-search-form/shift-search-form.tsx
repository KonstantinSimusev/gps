import { useContext, useEffect, useState } from 'react';

import { toDateString } from '../../../utils/utils';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { useDispatch, useSelector } from '../../../services/store';
import { getShiftsByDate } from '../../../services/slices/shift/actions';

import {
  clearSearchShiftsError,
  selectIsSearchShiftsLoading,
  selectSearchShiftsError,
} from '../../../services/slices/shift/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { ServerError } from '../../ui/server-error/server-error';
import { Spinner } from '../../ui/spinner/spinner';

import styles from './shift-search-form.module.css';

interface IFormData extends Record<string, string> {
  shiftDate: string;
}

export const ShiftSearchForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsSearchShiftsLoading);
  const serverError = useSelector(selectSearchShiftsError);

  const {
    isShiftSearchOpen,
    setIsOverlayOpen,
    setIsShiftSearchOpen,
    setSelectedDate,
  } = useContext(LayerContext);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    shiftDate: '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    shiftDate: '',
  });

  useEffect(() => {
    if (isShiftSearchOpen) {
      dispatch(clearSearchShiftsError());
    }
  }, [isShiftSearchOpen]);

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
    dispatch(clearSearchShiftsError());
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

    try {
      await dispatch(
        getShiftsByDate({ shiftDate: toDateString(formData.shiftDate) }),
      ).unwrap();

      setSelectedDate(toDateString(formData.shiftDate));

      setIsShiftSearchOpen(false);
      setIsOverlayOpen(false);
    } catch (error) {
      throw new Error('Что-то пошло не так');
    }

    setFormData({ shiftDate: '' });
    setErrors({ shiftDate: '' });
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled =
    isLoading || Object.values(errors).some(Boolean) || !formData.shiftDate;

  return (
    <Form
      title='Поиск смены'
      onSubmit={handleSubmit}
      className={styles.container}
    >
      <TextInput
        type='text'
        name='shiftDate'
        placeholder='дд.мм.гггг'
        value={formData.shiftDate}
        label='Дата'
        error={errors.shiftDate}
        onChange={handleChange}
        onBlur={handleBlur}
        className={styles.input}
      />

      <div className={styles.message}>
        {isLoading ? <Spinner /> : <ServerError text={serverError} />}
      </div>

      <Button
        type='submit'
        disabled={isButtonDisabled}
        className={styles.button}
      >
        Найти
      </Button>
    </Form>
  );
};
