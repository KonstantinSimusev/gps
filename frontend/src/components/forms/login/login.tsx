import styles from './login.module.css';

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../spinner/spinner';

import { useDispatch, useSelector } from '../../../services/store';
import {
  selectError,
  selectIsLoading,
  clearError,
} from '../../../services/slices/auth/slice';
import { LayerContext } from '../../../contexts/layer/layerContext';
import { loginUser } from '../../../services/slices/auth/actions';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';
import { IUser } from '../../../utils/api.interface';
import { TRole } from '../../../utils/types';

// Изменим тип ILoginData на Record<string, string>
interface ILoginData extends Record<string, string> {
  login: string;
  password: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const { isLoginModalOpen, setIsOpenOverlay, setIsLoginModalOpen } =
    useContext(LayerContext);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<ILoginData>({
    login: '',
    password: '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    login: '',
    password: '',
  });

  useEffect(() => {
    if (isLoginModalOpen) {
      dispatch(clearError());
    }
  }, [isLoginModalOpen, dispatch]);

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
        const response = await dispatch(loginUser(formData));

        // Проверяем, было ли действие успешно выполнено
        if (loginUser.fulfilled.match(response)) {
          const user: IUser = response.payload;
          const master: TRole = 'MASTER';

          navigate(user.role === master ? '/timesheet' : '/home');

          setIsLoginModalOpen(false);
          setIsOpenOverlay(false);
          setFormData({ login: '', password: '' });
          setErrors({ login: '', password: '' });
        } else {
          setFormData({ login: '', password: '' });
          throw new Error();
        }
      } catch (error) {
        throw new Error();
      }
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading || !formData.login || !formData.password;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Авторизация</h3>
      <form className={styles.form__login} onSubmit={handleSubmit}>
        <label className={styles.input__name}>Логин</label>
        <input
          className={styles.input__login}
          type='text'
          name='login'
          value={formData.login}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className={styles.errors}>
          {errors.login && <span className={styles.error}>{errors.login}</span>}
        </div>

        <label className={styles.input__name}>Пароль</label>
        <input
          className={styles.input__password}
          type='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className={styles.errors}>
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>

        <div className={styles.spinner}>{isLoading && <Spinner />}</div>
        {<div className={styles.errors__server}>{error}</div>}

        <button
          type='submit'
          className={styles.button__login}
          disabled={isButtonDisabled}
          style={{
            opacity: isButtonDisabled ? 0.4 : 0.9,
          }}
        >
          Войти
        </button>
      </form>
    </div>
  );
};
