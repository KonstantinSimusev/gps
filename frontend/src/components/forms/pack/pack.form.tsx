import styles from './pack.form.module.css';

import { useContext, useEffect, useState } from 'react';

import { Spinner } from '../../spinner/spinner';

import { useDispatch, useSelector } from '../../../services/store';
import { selectLastShift } from '../../../services/slices/shift/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

import {
  selectIsLoadingPacks,
  clearError,
  selectError,
} from '../../../services/slices/pack/slice';
import { updatePack } from '../../../services/slices/pack/actions';
import { getLastTeamShift } from '../../../services/slices/shift/actions';

// Изменим тип IFormData на Record<string, string>
interface IFormData extends Record<string, string> {
  count: string;
}

export const PackForm = () => {
  const dispatch = useDispatch();

  const { isPackOpenMdal, selectedId, setIsOpenOverlay, setIsPackOpenMdal } =
    useContext(LayerContext);

  const lastShift = useSelector(selectLastShift);

  const pack = lastShift?.packs?.find((pack) => pack.id === selectedId);

  const isLoading = useSelector(selectIsLoadingPacks);
  const error = useSelector(selectError);

  // Состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    count: '',
  });

  // Состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    count: '',
  });

  // 1. Очищаем ошибки при открытии модалки
  useEffect(() => {
    if (isPackOpenMdal) {
      dispatch(clearError());
    }
  }, [isPackOpenMdal, dispatch]);

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
          id: selectedId,
          count: Number(formData.count),
          shiftId: lastShift?.id,
        };

        const response = await dispatch(updatePack(payload));

        if (response.payload) {
          setIsPackOpenMdal(false);
          setIsOpenOverlay(false);

          dispatch(getLastTeamShift());
        }
      } catch (error) {
        // dispatch(clearError())
        throw new Error();
      }
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading || !formData.count;

  return (
    <div className={styles.container}>
      <div className={styles.location}>
        <h3 className={styles.title}>{`${pack?.location}`}</h3>
        <h3 className={styles.title}>{`${pack?.area}`}</h3>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.input__name}>Упаковка за смену</label>
        <input
          className={styles.input}
          type='text'
          name='count'
          value={formData.count}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className={styles.errors}>
          {errors.count && <span className={styles.error}>{errors.count}</span>}
        </div>

        <div className={styles.spinner}>{isLoading && <Spinner />}</div>
        {<div className={styles.errors__server}>{error}</div>}

        <button
          type='submit'
          className={styles.button}
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
