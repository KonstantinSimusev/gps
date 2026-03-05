// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { EmployeeService } from './employee.service';
// import { EmployeeRepository } from './employee.repository';
// import { CreateEmployeeDTO } from './dto/create-employee.dto';
// import { CreateEmployeesDTO } from './dto/create-employees.dto';
// import { Employee } from './entities/employee.entity';

// describe('EmployeeService', () => {
//   let service: EmployeeService;
//   // Убираем тип MockEmployeeRepository — теперь это просто EmployeeRepository
//   let repository: EmployeeRepository;

//   beforeEach(async () => {
//     const mockRepository = {
//       create: jest.fn(),
//       createMany: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         EmployeeService,
//         {
//           provide: EmployeeRepository,
//           useValue: mockRepository,
//         },
//         {
//           provide: getRepositoryToken(Employee),
//           useValue: {},
//         },
//       ],
//     }).compile();

//     service = module.get<EmployeeService>(EmployeeService);
//     // Явно приводим к типу с Jest-моками
//     repository = module.get<EmployeeRepository>(
//       EmployeeRepository,
//     ) as unknown as EmployeeRepository & {
//       create: jest.Mock;
//       createMany: jest.Mock;
//     };
//   });

//   describe('createEmployees', () => {
//     it('должен успешно создать сотрудников при валидных данных', async () => {
//       const validDtos: CreateEmployeesDTO = {
//         employees: [
//           {
//             lastName: 'Иванов',
//             firstName: 'Иван',
//             patronymic: 'Иванович',
//             personalNumber: '12345',
//           },
//           {
//             lastName: 'Петров',
//             firstName: 'Пётр',
//             patronymic: 'Петрович',
//             personalNumber: '67890',
//           },
//         ],
//       };

//       (repository.createMany as jest.Mock).mockResolvedValue(
//         validDtos.employees as Employee[],
//       );

//       const result = await service.createEmployees(validDtos);

//       expect(result.total).toBe(2);
//       expect(result.items).toHaveLength(2);
//       expect(repository.createMany).toHaveBeenCalledTimes(1);
//       // Исправлена строка ниже: передаём весь объект validDtos
//       expect(repository.createMany).toHaveBeenCalledWith(validDtos);
//     });

//     it('должен выбросить ошибку при невалидных данных', async () => {
//       const invalidDtos: CreateEmployeesDTO = {
//         employees: [
//           {
//             lastName: 'Сидоров',
//             firstName: 'Сидор',
//             patronymic: 'Сидорович',
//             personalNumber: '123a',
//           },
//         ],
//       };

//       (repository.createMany as jest.Mock).mockRejectedValue(
//         new Error('Validation failed'),
//       );

//       await expect(service.createEmployees(invalidDtos)).rejects.toThrow(
//         'Validation failed',
//       );

//       expect(repository.createMany).toHaveBeenCalledTimes(1);
//     });
//   });
// });
