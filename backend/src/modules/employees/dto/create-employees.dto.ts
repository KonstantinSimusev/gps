import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateEmployeeDTO } from './create-employee.dto';

// Объявляем класс CreateEmployeesDTO — DTO (Data Transfer Object) для создания нескольких сотрудников
export class CreateEmployeesDTO {
  // Указываем, что поле employees содержит массив объектов типа CreateEmployeeDTO.
  // Декоратор @Type из библиотеки class-transformer задаёт тип элементов массива для корректной трансформации данных
  @Type(() => CreateEmployeeDTO)
  // Указываем, что каждый элемент массива employees должен быть валидирован как вложенный объект.
  // Декоратор @ValidateNested из библиотеки class-validator запускает валидацию для каждого элемента массива.
  // Опция { each: true } означает, что валидация применяется к каждому элементу массива по отдельности
  @ValidateNested({ each: true })
  // Объявление поля employees: массив объектов типа CreateEmployeeDTO, представляющий список сотрудников для создания
  employees: CreateEmployeeDTO[];
}
