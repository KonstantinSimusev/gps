import { useContext, useEffect, useState } from 'react';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { useDispatch, useSelector } from '../../../services/store';

import { createEmployeeShift } from '../../../services/slices/employee-shift/actions';
import { getShiftById } from '../../../services/slices/shift/actions';

import {
  clearCreateEmployeeShift,
  selectCreateEmployeeShiftError,
} from '../../../services/slices/employee-shift/slice';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { ServerError } from '../../ui/server-error/server-error';

import styles from './employee-add-form.module.css';

interface IFormData extends Record<string, string> {
  personalNumber: string;
}

export const EmployeeAddForm = () => {
  const {
    isEmployeeAddOpen,
    selectedId,
    setIsOverlayOpen,
    setIsEmployeeAddOpen,
  } = useContext(LayerContext);

  const dispatch = useDispatch();

  // Лоадер и ошибка именно для создания смены
  const serverError = useSelector(selectCreateEmployeeShiftError);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    personalNumber: '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    personalNumber: '',
  });

  useEffect(() => {
    if (isEmployeeAddOpen) {
      dispatch(clearCreateEmployeeShift());
    }
  }, [isEmployeeAddOpen]);

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
    dispatch(clearCreateEmployeeShift());
  };

  // Обработчик потери фокуса для валидации
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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

    try {
      await dispatch(
        createEmployeeShift({
          shiftId: selectedId,
          personalNumber: Number(formData.personalNumber),
        }),
      ).unwrap();

      dispatch(getShiftById(selectedId));

      setIsEmployeeAddOpen(false);
      setIsOverlayOpen(false);

      setFormData({ personalNumber: '' });
      setErrors({ personalNumber: '' });
    } catch (error) {
      throw new Error();
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled =
    Object.values(errors).some(Boolean) || !formData.personalNumber;

  return (
    <Form
      title='Новый работник'
      onSubmit={handleSubmit}
      className={styles.container}
    >
      <TextInput
        type='text'
        name='personalNumber'
        label='Личный номер'
        placeholder='12345'
        value={formData.personalNumber}
        error={errors.personalNumber}
        className={styles.input}
        onBlur={handleBlur}
        onChange={handleChange}
        autoFocus
      />

      <div className={styles.message}>
        <ServerError text={serverError} />
      </div>

      <Button
        type='submit'
        disabled={isButtonDisabled}
        className={styles.button}
      >
        Добавить
      </Button>
    </Form>
  );
};
