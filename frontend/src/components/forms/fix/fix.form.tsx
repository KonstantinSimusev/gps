import styles from './fix.form.module.css';

import { useContext, useEffect, useState } from 'react';

import { Spinner } from '../../spinner/spinner';

import { useDispatch, useSelector } from '../../../services/store';
import { selectCurrentShiftId } from '../../../services/slices/shift/slice';
import { getFixs, updateFix } from '../../../services/slices/fix/actions';

import {
  selectFixById,
  clearError,
  selectError,
  selectIsLoadingFixs,
} from '../../../services/slices/fix/slice';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  validateField,
  validateForm,
  validationRules,
} from '../../../utils/validation';

// Изменим тип IFormData на Record<string, string>
interface IFormData extends Record<string, string> {
  count: string;
}

export const FixForm = () => {
  const dispatch = useDispatch();

  const {
    isFixOpenMdal,
    selectedId,
    setIsOpenOverlay,
    setIsFixOpenMdal,
  } = useContext(LayerContext);

  const fix = useSelector((state) =>
    selectFixById(state, selectedId),
  );

  const currentShiftId = useSelector(selectCurrentShiftId);

  const isLoading = useSelector(selectIsLoadingFixs);
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
    if (isFixOpenMdal) {
      dispatch(clearError());
    }
  }, [isFixOpenMdal, dispatch]);

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
        };

        const response = await dispatch(updateFix(payload));

        if (response.payload) {
          setIsFixOpenMdal(false);
          setIsOpenOverlay(false);

          if (!currentShiftId) {
            return null;
          }

          dispatch(getFixs(currentShiftId));
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
        <h3 className={styles.title}>{`${fix?.location}`}</h3>
        <h3 className={styles.title}>{`${fix?.railway}`}</h3>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.input__name}>Раскрепление за смену</label>
        <input
          className={styles.input}
          type="text"
          name="count"
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
          type="submit"
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
