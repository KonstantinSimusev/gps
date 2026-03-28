import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../services/store';

import {
  selectError,
  selectIsLoading,
  clearError,
} from '../../../services/slices/auth/slice';

import { loginEmployee } from '../../../services/slices/auth/actions';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { ROLE_TO_PAGE } from '../../../utils/utils';

import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';

import styles from './login-form.module.css';

interface IFormData extends Record<string, string> {
  login: string;
  password: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const serverError = useSelector(selectError);

  const { isLoginOpen, setIsOverlayOpen, setIsLoginOpen } =
    useContext(LayerContext);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    login: '',
    password: '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    login: '',
    password: '',
  });

  useEffect(() => {
    if (isLoginOpen) {
      dispatch(clearError());
    }
  }, [isLoginOpen]);

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

    // Если форма невалидна, выход
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    {
      try {
        const employee = await dispatch(loginEmployee(formData)).unwrap();
        const targetPage = ROLE_TO_PAGE[employee.role || '/'];

        navigate(targetPage);

        setIsLoginOpen(false);
        setIsOverlayOpen(false);

        setFormData({ login: '', password: '' });
        setErrors({ login: '', password: '' });
      } catch (error) {
        throw new Error();
      }
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading || !formData.login || !formData.password;

  return (
    <Form title='Авторизация' onSubmit={handleSubmit}>
      <TextInput
        type='text'
        name='login'
        label='Логин'
        value={formData.login}
        error={errors.login}
        onChange={handleChange}
        onBlur={handleBlur}
        className={styles.input}
      />

      <TextInput
        type='password'
        name='password'
        label='Пароль'
        value={formData.password}
        error={errors.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Spinner
        isLoading={isLoading}
        serverError={serverError}
        className={styles.spinner}
      />

      <Button
        type='submit'
        label='Войти'
        disabled={isButtonDisabled}
        className={styles.button}
      />
    </Form>
  );
};
