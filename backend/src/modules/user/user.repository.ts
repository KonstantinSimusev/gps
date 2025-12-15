import { Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { EProfession } from '../../shared/enums/enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({});
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async update(user: User, updateData: Partial<User>): Promise<User> {
    return await this.userRepository.save({
      ...user,
      ...updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByLogin(login: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { login },
    });
  }

  async findUsersByTeam(teamNumber: number): Promise<User[]> {
    const teamUsers = await this.userRepository.find({
      where: [{ teamNumber: teamNumber }, { currentTeamNumber: teamNumber }],
    });
    return teamUsers;
  }

  async findUserByPersonalNumber(personalNumber: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        personalNumber,
        profession: Not(EProfession.MASTER),
      },
    });

    return user;
  }

  async findLPC11All(): Promise<User[]> {
    return await this.userRepository.find({
      where: { workshopCode: 'ЛПЦ-11' },
      select: {
        profession: true,
        grade: true,
      },
    });
  }
}
