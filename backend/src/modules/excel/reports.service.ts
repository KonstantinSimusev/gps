// import * as ExcelJS from 'exceljs';

// import { Injectable } from '@nestjs/common';

// import { Response, Request } from 'express';
// import { IAccountInfo } from '../../shared/interfaces/api.interface';

// // import { ShiftService } from '../shift/shift.service';
// // import { ResidueRepository } from '../residue/residue.repository';
// // import { ELocation } from '../../shared/enums/enums';

// @Injectable()
// export class ReportsService {
//   constructor() // private readonly authService: AuthService, // private readonly residueRepository: ResidueRepository, // private readonly shiftService: ShiftService,
//   {}

//   async generateEmployeeExcel(employeeData: IAccountInfo) {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Данные сотрудника');

//     // Добавляем метаданные сверху
//     worksheet.mergeCells('A1:B1');
//     worksheet.getCell('A1').value = 'Данные нового сотрудника';

//     worksheet.addRow([]); // Отступ

//     // Шапка таблицы
//     const headerRow = worksheet.getRow(3);
//     headerRow.values = ['Параметр', 'Значение'];

//     // Стилизуем шапку
//     headerRow.eachCell((cell) => {
//       cell.font = { bold: true };
//       cell.alignment = { horizontal: 'center' };
//     });

//     // Ширина колонок
//     worksheet.getColumn('A').width = 20;
//     worksheet.getColumn('B').width = 30;

//     // Данные сотрудника
//     const dataRows = [
//       ['Фамилия', employeeData.lastName],
//       ['Имя', employeeData.firstName],
//       ['Отчество', employeeData.patronymic || '—'],
//       ['Логин', employeeData.login],
//       ['Пароль', employeeData.password],
//     ];

//     dataRows.forEach((row) => worksheet.addRow(row));

//     // Выравниваем данные по центру
//     for (let rowNum = 4; rowNum <= 8; rowNum++) {
//       const row = worksheet.getRow(rowNum);
//       row.eachCell((cell) => {
//         cell.alignment = { horizontal: 'center' };
//       });
//     }

//     // Запись в буфер
//     return await workbook.xlsx.writeBuffer();
//   }


//   async getResiduesReport(req: Request, res: Response): Promise<void> {
//     try {
//       // Получаем текущую активную смену
//       const finishedShift = await this.shiftService.getFinishedShift(req, res);

//       const residues = await this.residueRepository.findResiduesByShiftId(
//         finishedShift.id,
//       );

//       const dateValue = finishedShift.date
//         ? new Date(finishedShift.date) // преобразуем строку в Date
//         : null;

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Отчёт по остаткам');

//       // Добавляем метаданные сверху
//       worksheet.mergeCells('A1:C1');
//       worksheet.getCell('A1').value =
//         `Дата: ${dateValue.toLocaleDateString('ru-RU')}`;

//       worksheet.mergeCells('A2:C2');
//       worksheet.getCell('A2').value = `Смена: ${finishedShift.shiftNumber}`;

//       worksheet.mergeCells('A3:C3');
//       worksheet.getCell('A3').value = `Бригада: ${finishedShift.teamNumber}`;

//       // Отступаем на одну строку перед таблицей
//       worksheet.addRow([]);

//       // 3. Шапка таблицы (строка №5)
//       const headerRow = worksheet.getRow(5);
//       headerRow.values = ['1 очередь', '2 очередь', '3 очередь'];

//       // Центрируем шапку
//       headerRow.eachCell((cell) => {
//         cell.alignment = {
//           horizontal: 'center',
//         };
//       });

//       // 4. Ширина колонок
//       worksheet.getColumn('A').width = 15;
//       worksheet.getColumn('B').width = 15;
//       worksheet.getColumn('C').width = 15;

//       // 6. Заполняем единственную строку данными из residues
//       const rowData: (number | '-')[] = ['-', '-', '-'];

//       residues.forEach((residue) => {
//         if (residue.location === ELocation.LINE_1) {
//           rowData[0] = residue.count === 0 ? '-' : residue.count;
//         } else if (residue.location === ELocation.LINE_2) {
//           rowData[1] = residue.count === 0 ? '-' : residue.count;
//         } else if (residue.location === ELocation.LINE_3) {
//           rowData[2] = residue.count === 0 ? '-' : residue.count;
//         }
//       });

//       // Добавляем строку с данными в таблицу (строка 6)
//       worksheet.addRow(rowData);

//       // Получаем строку №6 (где находятся данные)
//       const dataRow = worksheet.getRow(6);

//       // Выравниваем все ячейки в строке по центру
//       dataRow.eachCell((cell) => {
//         cell.alignment = {
//           horizontal: 'center', // по горизонтали
//         };
//       });

//       // Запись в буфер
//       const excelBuffer = await workbook.xlsx.writeBuffer();

//       // Настройка HTTP-ответа для скачивания файла
//       res.setHeader(
//         'Content-Disposition',
//         'attachment; filename="users-report.xlsx"',
//       );

//       res.setHeader(
//         'Content-Type',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       );

//       res.send(excelBuffer);
//     } catch (error) {
//       // 1. Логируем ошибку с контекстом
//       console.error('[generateExcel] Ошибка при генерации Excel:', {
//         timestamp: new Date().toISOString(),
//         errorName: error.name,
//         errorMessage: error.message,
//         errorStack: error.stack,
//         context: 'Генерация Excel-файла для пользователей',
//       });

//       // 2. Перебрасываем ошибку с уточнённым сообщением
//       if (error instanceof Error) {
//         throw new Error(
//           `Не удалось сгенерировать Excel-файл: ${error.message}`,
//         );
//       } else {
//         throw new Error('Неизвестная ошибка при генерации Excel-файла');
//       }
//     }
//   }

// }
