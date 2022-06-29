import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { handleError } from 'src/utils/handle-error.util';
import { isAdmin } from 'src/utils/handle-admin.util';
import { ChangePassDto } from './dto/change-pass.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const data: User = {
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };
    return await this.prisma.user
      .create({
        data,
        select: {
          name: true,
          email: true,
          cpf: true,
          isAdmin: true,
          password: false,
        },
      })
      .catch(handleError);
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: false,
        isAdmin: true,
        password: false,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto, user: User) {
    isAdmin(user);
    const data: Partial<User> = { ...dto };
    return await this.prisma.user
      .update({
        where: { id },
        data,
      })
      .catch(handleError);
  }

  async delete(id: string, user: User) {
    isAdmin(user);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User successfully deleted' };
  }

  async changePass(changePassDto: ChangePassDto, user: User) {
    const userDB = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userDB) {
      throw new UnauthorizedException('User and/or password is invalid');
    }

    const isHashValid = await bcrypt.compare(
      changePassDto.oldPassword,
      userDB.password,
    );
    if (!isHashValid) {
      throw new UnauthorizedException('User and/or password is invalid');
    }

    if (changePassDto.password != changePassDto.confPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    userDB.password = await bcrypt.hash(changePassDto.password, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: userDB,
    });

    return { message: 'User`s password successfully updated' };
  }
}