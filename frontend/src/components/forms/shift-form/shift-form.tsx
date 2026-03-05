import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../services/store';

import { LayerContext } from '../../../contexts/layer/layerContext';

import {
  createShift,
  getLastShift,
} from '../../../services/slices/shift/actions';

import { getUsersShifts } from '../../../services/slices/user-shift/actions';

import {
  selectCreatedShiftError,
  clearError,
  selectIsLoadingCreatedShift,
} from '../../../services/slices/shift/slice';

import { validateForm, validationRules } from '../../../utils/validation';
import { ICreatedShift, IShift } from '../../../utils/api.interface';

import { Form } from '../../ui/form/form';
import { Spinner } from '../../ui/spinner/spinner';
import { Button } from '../../ui/button/button';
import { RadioInput } from '../../ui/inputs/radio-input/radio-input';

import styles from './shift-form.module.css';

// Обновляем тип IFormData для работы с number | null
interface IFormData extends Record<string, string> {
  shiftNumber: string;
}

export const ShiftForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoadingCreatedShift);
  const сreatedShiftError = useSelector(selectCreatedShiftError);
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
  }, [isAddShiftOpenModall]);

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
        const data: ICreatedShift = {
          date: new Date(),
          shiftNumber: parseInt(formData.shiftNumber, 10),
        };

        const response = await dispatch(createShift(data));

        if (response.payload) {
          const shift = response.payload as IShift;

          if (!shift.id) {
            console.error('Не удалось получить ID смены');
            return;
          }

          dispatch(getLastShift());
          dispatch(getUsersShifts(shift.id));
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
    <Form title='Выберите смену' onSubmit={handleSubmit}>
      <RadioInput
        type='radio'
        name='shift'
        value='1'
        text='Смена 1 (ночная)'
        checked={selectedShift === 1}
        onChange={handleRadioChange}
        className={styles.input}
      />

      <RadioInput
        type='radio'
        name='shift'
        value='2'
        text='Смена 2 (дневная)'
        checked={selectedShift === 2}
        onChange={handleRadioChange}
      />

      <Spinner
        isLoading={isLoading}
        serverError={сreatedShiftError}
        className={styles.spinner}
      />

      <Button
        type='submit'
        label='Создать'
        disabled={isButtonDisabled}
        className={styles.button}
      />
    </Form>
  );
};
