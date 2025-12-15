// Определяем тип для одного правила валидации
interface IValidationRule {
  type: string;
  pattern: RegExp;
  message: string;
  min?: number;
  max?: number;
}

// Определяем тип для поля валидации
interface IFieldValidation {
  required: boolean;
  validators: IValidationRule[];
}

// Определяем общий тип для всех правил валидации
interface IValidationRules {
  [fieldName: string]: IFieldValidation;
}

// Объект с расширенными правилами валидации
export const validationRules: IValidationRules = {
  email: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Это поле обязательно',
      },
      {
        type: 'noSpaces',
        pattern: /^\S+$/,
        message: 'Введите корректный адрес почты', // Email не должен содержать пробелы
      },
      {
        type: 'hasAtSymbol',
        pattern: /@/,
        message: 'Введите корректный адрес почты', // 'Отсутствует символ @
      },
      {
        type: 'atSymbolPosition',
        pattern: /^[^@]+@[^@]+$/,
        message: 'Введите корректный адрес почты', // Символ @ должен быть между другими символами
      },
      {
        type: 'domainPart',
        pattern: /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Введите корректный адрес почты', // Некорректная доменная часть emai
      },
      {
        type: 'latin',
        pattern: /^[a-zA-Z0-9._%+-@]+$/,
        message: 'Введите корректный адрес почты', // Разрешены только латинские символы, цифры и ._%+-@
      },
      {
        type: 'length',
        pattern: /^.{6,100}$/,
        message: 'Введите корректный адрес почты', // Email должен содержать от 6 до 50 символов
      },
      {
        type: 'noLeadingHyphen',
        pattern: /^[a-zA-Z0-9]/,
        message: 'Введите корректный адрес почты', // Домен не может начинаться с дефиса
      },
      {
        type: 'noDoubleHyphens',
        pattern: /^(?!.*--)/,
        message: 'Введите корректный адрес почты', // Запрещено использовать два дефиса подряд
      },
    ],
  },
  login: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Это поле обязательно',
      },
      {
        type: 'length',
        pattern: /^.{8,30}$/,
        message: 'Введите 8-30 символов',
      },
      {
        type: 'noSpaces',
        pattern: /^\S+$/,
        message: 'Введите корректный логин',
      },
      {
        type: 'uppercase',
        pattern: /[A-Z]/,
        message: 'Введите корректный логин', // Должна быть хотя бы одна заглавная буква
      },
    ],
  },
  password: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Это поле обязательно',
      },
      {
        type: 'length',
        pattern: /^.{8,30}$/,
        message: 'Введите 8-30 символов',
      },
      {
        type: 'noSpaces',
        pattern: /^\S+$/,
        message: 'Введите корректный пароль',
      },
      {
        type: 'uppercase',
        pattern: /[A-Z]/, // Проверяет наличие хотя бы одной заглавной буквы
        message: 'Введите корректный пароль', // Должна быть хотя бы одна заглавная буква
      },
    ],
  },
  personalNumber: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Это поле обязательно',
      },
      {
        type: 'number',
        pattern: /^\d+$/,
        message: 'Введите только цифры',
      },
      {
        type: 'minLength',
        pattern: /^\d{3,}$/,
        message: 'Введите минимум 3 цифры',
      },
      {
        type: 'maxLength',
        pattern: /^\d{1,10}$/,
        message: 'Введите не более 10 цифр',
      },
    ],
  },
  date: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Выберите дату',
      },
    ],
  },
  shiftNumber: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Выберите смену',
      },
      {
        type: 'number',
        pattern: /^\d+$/,
        message: 'Введите только цифры',
      },
      {
        type: 'length',
        pattern: /^(1|2)$/,
        message: 'Введите число 1 или 2',
      },
    ],
  },
  teamNumber: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Это поле обязательно',
      },
      {
        type: 'length',
        pattern: /^(1|2|3|4|5)$/,
        message: 'Введите чило от 1 до 5',
      },
    ],
  },
  workStatus: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Выберите статус',
      },
      {
        type: 'notDefault',
        pattern: /^(?!Не определен$).+/,
        message: 'Выберите статус',
      },
    ],
  },
  workPlace: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Выберите место',
      },
      {
        type: 'notDefault',
        pattern: /^(?!Не выбрано$).+/,
        message: 'Выберите место',
      },
    ],
  },
  workHours: {
    required: true,
    validators: [
      {
        type: 'decimal',
        // 1–2 цифры до точки, 0–1 цифра после; допускает , и .
        pattern: /^\d{1,2}(?:[,.]\d)?$/,
        message: 'Введите число от 0 до 12',
      },
      // {
      //   type: 'range',
      //   min: 0,
      //   max: 11.5,
      //   message: 'Значение должно быть от 0 до 11,5',
      // },
    ],
  },
  count: {
    required: true,
    validators: [
      {
        type: 'required',
        pattern: /^.+$/,
        message: 'Это поле обязательно',
      },
      {
        type: 'range',
        pattern: /^\d+$/,
        min: 0,
        max: 1000,
        message: 'Только целое число от 0 до 1000',
      },
    ],
  },
};

// Функция для валидации одного поля
export const validateField = (
  fieldName: string, // Имя поля, которое валидируем
  value: string, // Значение поля для проверки
  rules: IValidationRules, // Объект с правилами валидации
): string => {
  // Получаем правила валидации для конкретного поля
  const fieldRules = rules[fieldName];

  // Если поле не найдено в правилах валидации
  if (!fieldRules) return '';

  // Проходим по всем валидаторам поля
  for (const validator of fieldRules.validators) {
    if (fieldName === 'date' && !value) {
      return validator.message;
    }

    if (validator.type === 'decimal') {
      // 1. Синтаксическая проверка (формат)
      if (!validator.pattern?.test(value)) {
        return validator.message;
      }

      // 2. Числовая проверка диапазона (0–11.5)
      const numValue = parseFloat(value.replace(',', '.'));
      if (isNaN(numValue)) {
        return validator.message;
      }
      if (numValue < 0 || numValue > 12) {
        return 'Введите число от 0 до 12';
      }
    }

    if (validator.type === 'range') {
      // Если поле пустое — уже отловилось в 'integer'
      if (value === '') return validator.message;

      const num = Number(value);
      if (isNaN(num)) return validator.message;

      if (
        (validator.min !== undefined && num < validator.min) ||
        (validator.max !== undefined && num > validator.max)
      ) {
        return validator.message;
      }
    }

    // Если значение не соответствует регулярному выражению
    if (!validator.pattern.test(value)) {
      return validator.message; // Возвращаем сообщение об ошибке
    }
  }

  // Если все проверки пройдены, возвращаем пустую строку
  return '';
};

// Функция для валидации всей формы
export const validateForm = (
  formData: Record<string, string>, // Объект с данными формы
  rules: IValidationRules, // Объект с правилами валидации
): Record<string, string> => {
  const errors: Record<string, string> = {}; // Объект для хранения ошибок

  // Проходим по всем полям формы
  for (const fieldName in formData) {
    // Валидируем поле
    const error = validateField(fieldName, formData[fieldName], rules);
    // Если есть ошибка, сохраняем её
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors; // Возвращаем объект с ошибками
};
