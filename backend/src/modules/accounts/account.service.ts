import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Account } from './entities/account.entity';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async createAсcount(
    lastName: string,
    firstName: string,
    patronymic: string,
  ): Promise<{ account: Account; initialPassword: string }> {
    try {
      const login = this.generateLogin(lastName, firstName, patronymic);
      const password = uuidv4();

      // Генерируем соль и хешируем пароль
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Создаём экземпляр сущности с необходимыми полями
      const accountData: Partial<Account> = {
        login,
        hashedPassword,
      };

      // Сохраняем в базу данных
      const createdAccount = await this.accountsRepository.create(accountData);

      return {
        account: createdAccount,
        initialPassword: password, // возвращаем пароль один раз
      };
    } catch (error) {
      throw new InternalServerErrorException('Не удалось создать аккаунт');
    }
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
