import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLE_TO_PAGE } from '../../../utils/utils';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import { useDispatch, useSelector } from '../../../services/store';

import { loginEmployee } from '../../../services/slices/auth/actions';

import {
  clearAuthError,
  selectAuthError,
  selectIsAuthLoading,
} from '../../../services/slices/auth/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import { Button } from '../../ui/buttons/button/button';
import { Form } from '../../ui/form/form';
import { TextInput } from '../../ui/inputs/text-input/text-input';
import { ServerError } from '../../ui/errors/server-error/server-error';
import { Spinner } from '../../ui/spinner/spinner';

import styles from './login-form.module.css';

interface IFormData extends Record<string, string> {
  login: string;
  password: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsAuthLoading);
  const serverError = useSelector(selectAuthError);

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
      dispatch(clearAuthError());
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
    dispatch(clearAuthError());
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
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled =
    isLoading ||
    Object.values(errors).some(Boolean) ||
    !formData.login ||
    !formData.password;

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

      <div className={styles.message}>
        {isLoading ? <Spinner /> : <ServerError text={serverError} />}
      </div>

      <Button
        type='submit'
        disabled={isButtonDisabled}
        className={styles.button}
      >
        Войти
      </Button>
    </Form>
  );
};
