// import { useContext, useEffect, useState } from 'react';

// import { IUpdateEmployee } from '../../../utils/api.interface';

// import {
//   validateField,
//   validateForm,
//   validationRules,
// } from '../../../utils/validation';

// import { REASON_OPTIONS } from '../../../utils/types';
// import { formatDateForUI, formatDateForISO } from '../../../utils/utils';

// import { useDispatch, useSelector } from '../../../services/store';

// import { updateEmployee } from '../../../services/slices/employee/actions';

// import {
//   clearUpdateEmployeeError,
//   selectIsUpdateEmployeeLoading,
//   selectSearсhEmployee,
//   selectUpdateEmployeeError,
// } from '../../../services/slices/employee/slice';

// import { LayerContext } from '../../../contexts/layer/layerContext';

// import { Button } from '../../ui/buttons/button/button';
// import { Form } from '../../ui/form/form';
// import { SelectInput } from '../../ui/inputs/select-input/select-input';
// import { ServerError } from '../../ui/errors/server-error/server-error';
// import { Spinner } from '../../ui/spinner/spinner';
// import { TextInput } from '../../ui/inputs/text-input/text-input';

// import styles from './employee-edit-form.module.css';

// interface IFormData extends Record<string, string> {
//   lastName: string;
//   firstName: string;
//   patronymic: string;
//   personalNumber: string;
//   teamNumber: string;
//   positionCode: string;
//   birthDay: string;
//   startDate: string;
//   endDate: string;

//   currentTeamNumber: string;
//   currentPositionCode: string;
//   transferReason: string;
//   positionStartDate: string;
//   positionEndDate: string;
//   replacedPersonalNumber: string;
// }

// export const EmployeeEditForm = () => {
//   const { isEmployeeEditOpen, setIsOverlayOpen, setIsEmployeeEditOpen } =
//     useContext(LayerContext);

//   const dispatch = useDispatch();
//   const employee = useSelector(selectSearсhEmployee);
//   const isLoading = useSelector(selectIsUpdateEmployeeLoading);
//   const serverError = useSelector(selectUpdateEmployeeError);

//   if (!employee) {
//     return;
//   }

//   // Состояние для хранения значений полей формы
//   const [formData, setFormData] = useState<IFormData>({
//     lastName: employee.lastName,
//     firstName: employee.firstName,
//     patronymic: employee.patronymic,
//     personalNumber: employee.personalNumber,
//     teamNumber: employee.teamNumber,
//     positionCode: employee.positionCode,
//     birthDay: formatDateForUI(employee.birthDay),
//     startDate: formatDateForUI(employee.startDate),
//     endDate: formatDateForUI(employee.endDate || ''),
//     currentTeamNumber: employee.currentTeamNumber || '',
//     currentPositionCode: employee.currentPositionCode || '',
//     transferReason: employee.transferReason || '',
//     replacedPersonalNumber: employee.replacedPersonalNumber || '',
//     positionStartDate: employee.positionStartDate || '',
//     positionEndDate: employee.positionEndDate || '',
//   });

//   // Состояние для хранения ошибок валидации
//   const [errors, setErrors] = useState<{ [key: string]: string }>({
//     lastName: '',
//     firstName: '',
//     patronymic: '',
//     personalNumber: '',
//     teamNumber: '',
//     positionCode: '',
//     birthDay: '',
//     startDate: '',
//     endDate: '',
//     currentTeamNumber: '',
//     currentPositionCode: '',
//     transferReason: '',
//     replacedPersonalNumber: '',
//     positionStartDate: '',
//     positionEndDate: '',
//   });

//   useEffect(() => {
//     if (isEmployeeEditOpen) {
//       dispatch(clearUpdateEmployeeError());
//     }
//   }, [isEmployeeEditOpen]);

//   // Обработчик изменения поля ввода
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;

//     // Обновляем данные формы
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Сбрасываем ошибку при начале ввода
//     setErrors({
//       ...errors,
//       [name]: '',
//     });

//     // Очищаем ошибки с сервера
//     dispatch(clearUpdateEmployeeError());
//   };

//   // Обработчик потери фокуса для валидации
//   const handleBlur = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;

//     // Получаем ошибку валидации для поля
//     const validationError = validateField(name, value, validationRules);

//     // Обновляем состояние ошибок
//     setErrors({
//       ...errors,
//       [name]: validationError || '',
//     });
//   };

//   const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Валидируем всю форму
//     const formErrors = validateForm(formData, validationRules);

//     // Сохраняем все ошибки в состояние
//     setErrors(formErrors);

//     // Если форма невалидна, выход
//     if (Object.keys(formErrors).length > 0) {
//       return;
//     }

//     // Преобразование данных перед отправкой
//     const dataForBackend: IUpdateEmployee = {
//       lastName: formData.lastName,
//       firstName: formData.firstName,
//       patronymic: formData.patronymic,
//       personalNumber: formData.personalNumber,
//       teamNumber: formData.teamNumber,
//       positionCode: formData.positionCode,

//       // Преобразование строк в Date
//       birthDay: formatDateForISO(formData.birthDay),
//       startDate: formatDateForISO(formData.startDate),

//       // endDate: если пустая строка — null, иначе Date
//       endDate:
//         formData.endDate === '' ? null : formatDateForISO(formData.endDate),

//       // Поля текущей позиции
//       currentTeamNumber:
//         formData.currentTeamNumber === '' ? null : formData.currentTeamNumber,

//       currentPositionCode:
//         formData.currentPositionCode === ''
//           ? null
//           : formData.currentPositionCode,

//       transferReason:
//         formData.transferReason === '' ? null : formData.transferReason,

//       replacedPersonalNumber:
//         formData.replacedPersonalNumber === ''
//           ? null
//           : formData.replacedPersonalNumber,

//       positionStartDate:
//         formData.positionStartDate === ''
//           ? null
//           : formatDateForISO(formData.positionStartDate),

//       positionEndDate:
//         formData.positionEndDate === ''
//           ? null
//           : formatDateForISO(formData.positionEndDate),
//     };

//     const payload = {
//       id: employee.id,
//       data: dataForBackend,
//     };

//     try {
//       await dispatch(updateEmployee(payload)).unwrap();

//       setIsEmployeeEditOpen(false);
//       setIsOverlayOpen(false);

//       setFormData({
//         lastName: '',
//         firstName: '',
//         patronymic: '',
//         personalNumber: '',
//         teamNumber: '',
//         positionCode: '',
//         birthDay: '',
//         startDate: '',
//         endDate: '',
//         currentTeamNumber: '',
//         currentPositionCode: '',
//         transferReason: '',
//         replacedPersonalNumber: '',
//         positionStartDate: '',
//         positionEndDate: '',
//       });

//       setErrors({
//         lastName: '',
//         firstName: '',
//         patronymic: '',
//         personalNumber: '',
//         teamNumber: '',
//         positionCode: '',
//         birthDay: '',
//         startDate: '',
//         endDate: '',
//         currentTeamNumber: '',
//         currentPositionCode: '',
//         transferReason: '',
//         replacedPersonalNumber: '',
//         positionStartDate: '',
//         positionEndDate: '',
//       });
//     } catch (error) {
//       throw new Error('Что-то пошло не так');
//     }
//   };

//   // Определяем, заблокирована ли кнопка
//   const isButtonDisabled =
//     isLoading ||
//     Object.values(errors).some(Boolean) ||
//     !formData.lastName ||
//     !formData.firstName ||
//     !formData.patronymic ||
//     !formData.personalNumber ||
//     !formData.teamNumber ||
//     !formData.positionCode ||
//     !formData.birthDay ||
//     !formData.startDate;

//   return (
//     <Form title='Профиль' onSubmit={handleSubmit} className={styles.container}>
//       <TextInput
//         type='text'
//         name='lastName'
//         label='Фамилия'
//         value={formData.lastName}
//         error={errors.lastName}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         className={styles.input}
//       />

//       <TextInput
//         type='text'
//         name='firstName'
//         label='Имя'
//         value={formData.firstName}
//         error={errors.firstName}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='patronymic'
//         label='Отчество'
//         value={formData.patronymic}
//         error={errors.patronymic}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='personalNumber'
//         label='Личный номер'
//         value={formData.personalNumber}
//         error={errors.personalNumber}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='teamNumber'
//         label='Бригада'
//         value={formData.teamNumber}
//         error={errors.teamNumber}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='positionCode'
//         label='Штатная позиция'
//         value={formData.positionCode}
//         error={errors.positionCode}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='birthDay'
//         label='Дата рождения'
//         value={formData.birthDay}
//         placeholder='дд.мм.гггг'
//         error={errors.birthDay}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='startDate'
//         label='Дата назначения'
//         value={formData.startDate}
//         placeholder='дд.мм.гггг'
//         error={errors.startDate}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='endDate'
//         label='Дата увольнения'
//         value={formData.endDate}
//         placeholder='дд.мм.гггг'
//         error={errors.endDate}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='currentTeamNumber'
//         label='Текущая бригада'
//         value={formData.currentTeamNumber}
//         error={errors.currentTeamNumber}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='currentPositionCode'
//         label='Текущая штатная позиция'
//         value={formData.currentPositionCode}
//         error={errors.currentPositionCode}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <SelectInput
//         name='transferReason'
//         label='Причина перевода'
//         value={formData.transferReason}
//         options={REASON_OPTIONS}
//         error={errors.transferReason}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='replacedPersonalNumber'
//         label='Личный номер заменяемого'
//         value={formData.replacedPersonalNumber}
//         error={errors.replacedPersonalNumber}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='positionStartDate'
//         label='Дата назначения позиции'
//         value={formData.positionStartDate}
//         placeholder='дд.мм.гггг'
//         error={errors.positionStartDate}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <TextInput
//         type='text'
//         name='positionEndDate'
//         label='Дата завершения позиции'
//         value={formData.positionEndDate}
//         placeholder='дд.мм.гггг'
//         error={errors.positionEndDate}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />

//       <div className={styles.message}>
//         {isLoading ? <Spinner /> : <ServerError text={serverError} />}
//       </div>

//       <Button
//         type='submit'
//         disabled={isButtonDisabled}
//         className={styles.button}
//       >
//         Сохранить
//       </Button>
//     </Form>
//   );
// };
