import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { IAccountInfo, IProfile } from '../../shared/interfaces/api.interface';
import { ERole } from '../../shared/enums/enums';

import { AccountRepository } from '../account/account.repository';
import { EmployeeRepository } from '../employee/employee.repository';

@Injectable()
export class EmployeeAccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async updateLoginAndPassword(
    employeeId: string,
    profile: IProfile,
  ): Promise<IAccountInfo> {
    // Проверяем права на данную операцию
    if (profile.role !== ERole.ADMIN) {
      throw new ForbiddenException('Недостаточно прав');
    }

    // Находим работника по ID
    const employee =
      await this.employeeRepository.findActiveEmployeeById(employeeId);

    if (!employee) {
      throw new NotFoundException('Работник не найден');
    }

    // Сравниваем цеха работника и профиля
    if (employee.position.workshop.workshopCode !== profile.workshopCode) {
      throw new ConflictException('Разные цеха');
    }

    // Генерируем новый логин
    const newLogin = this.generateLogin(
      employee.lastName,
      employee.firstName,
      employee.patronymic,
    );

    // Генерируем новый пароль
    const newPassword = uuidv4();

    // Генерируем соль и хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Обновляем только нужные поля
    await this.accountRepository.update(employee.account.id, {
      login: newLogin,
      hashedPassword: newHashedPassword,
    });

    return {
      lastName: employee.lastName,
      firstName: employee.firstName,
      patronymic: employee.patronymic,
      login: newLogin,
      password: newPassword,
    };
  }

  private generateLogin(
    lastName: string,
    firstName: string,
    patronymic: string,
  ): string {
    // Функция для транслитерации русских букв в латинские
    const transliterate = (text: string): string => {
      const translitMap: { [key: string]: string } = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'yo',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'y',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'kh',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ы: 'y',
        э: 'e',
        ю: 'yu',
        я: 'ya',
        А: 'A',
        Б: 'B',
        В: 'V',
        Г: 'G',
        Д: 'D',
        Е: 'E',
        Ё: 'Yo',
        Ж: 'Zh',
        З: 'Z',
        И: 'I',
        Й: 'Y',
        К: 'K',
        Л: 'L',
        М: 'M',
        Н: 'N',
        О: 'O',
        П: 'P',
        Р: 'R',
        С: 'S',
        Т: 'T',
        У: 'U',
        Ф: 'F',
        Х: 'Kh',
        Ц: 'Ts',
        Ч: 'Ch',
        Ш: 'Sh',
        Щ: 'Shch',
        Ы: 'Y',
        Э: 'E',
        Ю: 'Yu',
        Я: 'Ya',
      };

      return text
        .split('')
        .map((char) => translitMap[char] || char)
        .join('');
    };

    // Транслитерируем фамилию, имя и отчество
    const lastNameLatin = transliterate(lastName).toUpperCase();
    const firstNameInitial = transliterate(firstName)[0].toUpperCase();
    const patronymicInitial = transliterate(patronymic)[0].toUpperCase();

    // Генерация случайного суффикса из 4 символов (буквы + цифры)
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const suffixLength = 4;
    let randomSuffix = '';

    for (let i = 0; i < suffixLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomSuffix += characters.charAt(randomIndex);
    }

    // Формируем логин в требуемом формате
    return `GPS_${lastNameLatin}_${firstNameInitial}${patronymicInitial}_${randomSuffix}`;
  }
}
