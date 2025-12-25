import styles from './production.form.module.css';

import { useContext, useEffect, useState } from 'react';

import { Spinner } from '../../spinner/spinner';

import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';
import {
  clearError,
  selectError,
  selectIsLoadingProductions,
} from '../../../services/slices/production/slice';
import { formatProductionUnit } from '../../../utils/utils';
import { updateProduction } from '../../../services/slices/production/actions';
import { selectLastShift } from '../../../services/slices/shift/slice';
import { getLastTeamShift } from '../../../services/slices/shift/actions';

// Изменим тип IFormData на Record<string, string>
interface IFormData extends Record<string, string> {
  count: string;
}

export const ProductionForm = () => {
  const dispatch = useDispatch();
  const lastShift = useSelector(selectLastShift);

  const {
    isProductionOpenMdal,
    selectedId,
    setIsOpenOverlay,
    setIsProductionOpenMdal,
  } = useContext(LayerContext);

  const production = lastShift?.productions?.find(
    (production) => production.id === selectedId,
  );

  const isLoading = useSelector(selectIsLoadingProductions);
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
    if (isProductionOpenMdal) {
      dispatch(clearError());
    }
  }, [isProductionOpenMdal, dispatch]);

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

        const response = await dispatch(updateProduction(payload));

        if (response.payload) {
          setIsProductionOpenMdal(false);
          setIsOpenOverlay(false);

          dispatch(getLastTeamShift());
        }
      } catch (error) {
        throw new Error();
      }
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading || !formData.count;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{formatProductionUnit(production?.unit)}</h3>
      <form className={styles.form__production} onSubmit={handleSubmit}>
        <label className={styles.input__name}>Производство за смену</label>
        <input
          className={styles.input__production}
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
          className={styles.button__production}
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
