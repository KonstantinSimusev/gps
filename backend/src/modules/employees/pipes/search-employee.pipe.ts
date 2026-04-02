import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { SearchEmployeeDTO } from '../dto/search-employee.dto';

@Injectable()
export class SearchEmployeePipe implements PipeTransform {
  async transform(value: string): Promise<string> {
    const dto = new SearchEmployeeDTO();
    dto.personalNumber = value;

    const errors = await validate(dto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join('. '))
        .join('. ');

      throw new BadRequestException(`Ошибка валидации: ${errorMessages}`);
    }

    return value; // Возвращаем исходное значение, если валидация пройдена
  }
}
