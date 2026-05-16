import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { useDispatch, useSelector } from '../../../services/store';

import { searchEmployee } from '../../../services/slices/employee/actions';

import {
  clearSearchEmployeeError,
  selectIsSearchEmployeeLoading,
  selectSearchEmployeeError,
} from '../../../services/slices/employee/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { ServerError } from '../../ui/errors/server-error/server-error';
import { Spinner } from '../../ui/spinner/spinner';

import styles from './employee-seach-form.module.css';

interface IFormData extends Record<string, string> {
  personalNumber: string;
}

export const EmployeeSearchForm = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsSearchEmployeeLoading);
  const serverError = useSelector(selectSearchEmployeeError);

  const { isEmployeeSearchOpen, setIsOverlayOpen, setIsEmployeeSearchOpen } =
    useContext(LayerContext);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    personalNumber: '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    personalNumber: '',
  });

  useEffect(() => {
    if (isEmployeeSearchOpen) {
      dispatch(clearSearchEmployeeError());
    }
  }, [isEmployeeSearchOpen]);

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
    dispatch(clearSearchEmployeeError());
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
      await dispatch(searchEmployee(formData.personalNumber)).unwrap();

      navigate('/admin');

      setIsEmployeeSearchOpen(false);
      setIsOverlayOpen(false);

      setFormData({ personalNumber: '' });
      setErrors({ personalNumber: '' });
    } catch (error) {
      throw new Error();
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled =
    isLoading ||
    Object.values(errors).some(Boolean) ||
    !formData.personalNumber;

  return (
    <Form
      title='Поиск работника'
      onSubmit={handleSubmit}
      className={styles.container}
    >
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
