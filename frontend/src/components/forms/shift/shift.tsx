import styles from './shift.module.css';

import { useContext, useEffect, useState } from 'react';
import { Spinner } from '../../spinner/spinner';

import { useDispatch, useSelector } from '../../../services/store';
import {
  selectError,
  selectIsLoadingShift,
  clearError,
} from '../../../services/slices/shift/slice';
import { LayerContext } from '../../../contexts/layer/layerContext';

import { validateForm, validationRules } from '../../../utils/validation';
import {
  createShift,
  getLastTeamShift,
} from '../../../services/slices/shift/actions';
import type { IShift } from '../../../utils/api.interface';
import { selectUser } from '../../../services/slices/auth/slice';

// Обновляем тип IFormData для работы с number | null
interface IFormData extends Record<string, string> {
  shiftNumber: string;
}

export const ShiftForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoadingShift);
  const serverError = useSelector(selectError);
  const { isAddShiftOpenModall, setIsOpenOverlay, setIsAddShiftOpenModall } =
    useContext(LayerContext);

  // Обновляем состояние для хранения выбранной смены
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  // Обновляем состояние для хранения значений полей формы
  const [formData, setFormData] = useState<IFormData>({
    shiftNumber: '',
  });

  // Обновляем состояние для хранения ошибок валидации
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    shiftNumber: '',
  });

  useEffect(() => {
    if (isAddShiftOpenModall) {
      dispatch(clearError());
    }
  }, [isAddShiftOpenModall, dispatch]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedShift(parseInt(value, 10));
    setFormData({
      ...formData,
      shiftNumber: value,
    });

    // Очищаем ошибку при выборе смены
    if (value) {
      setErrors({
        ...errors,
        shiftNumber: '',
      });

      dispatch(clearError());
    }
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
        const data: IShift = {
          date: new Date(),
          shiftNumber: parseInt(formData.shiftNumber ?? '0', 10),
          teamNumber: user?.currentTeamNumber ?? 0,
        };

        const response = await dispatch(createShift(data));

        if (response.payload) {
          dispatch(getLastTeamShift());
          setIsAddShiftOpenModall(false);
          setIsOpenOverlay(false);
        } else {
          throw new Error();
        }
      } catch (error) {
        throw new Error();
      }
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = isLoading || !formData.shiftNumber;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Выберите смену</h3>
      <form className={styles.form__shift} onSubmit={handleSubmit}>
        <label className={styles.shift}>
          <input
            className={styles.visually__hidden}
            type="radio"
            name="shift"
            value="1"
            checked={selectedShift === 1}
            onChange={handleRadioChange}
          />
          <span className={styles.input__custom}></span>
          <span className={styles.input__text}>Смена 1 (ночная)</span>
        </label>

        <label className={styles.shift}>
          <input
            className={styles.visually__hidden}
            type="radio"
            name="shift"
            value="2"
            checked={selectedShift === 2}
            onChange={handleRadioChange}
          />
          <span className={styles.input__custom}></span>
          <span className={styles.input__text}>Смена 2 (дневная)</span>
        </label>

        <div className={styles.spinner}>{isLoading && <Spinner />}</div>

        {
          <div className={styles.errors__server}>
            <span>{serverError}</span>
            <span>
              {errors.shiftNumber && (
                <span className={styles.error}>{errors.shiftNumber}</span>
              )}
            </span>
          </div>
        }

        <button
          type="submit"
          className={styles.button__shift}
          disabled={isButtonDisabled}
          style={{
            opacity: isButtonDisabled ? 0.4 : 0.9,
          }}
        >
          Создать
        </button>
      </form>
    </div>
  );
};
