import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { isAdmin } from 'src/utils/handle-admin.util';
import { handleError } from 'src/utils/handle-error.util';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateGenreDto, user: User) {
    isAdmin(user);
    return this.prisma.genre.create({ data: dto }).catch(handleError);
  }

  findAll() {
    return this.prisma.genre.findMany();
  }

  findAllGames() {
    return this.prisma.genre.findMany({
      include: {
        games: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.genre.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateGenreDto, user: User) {
    isAdmin(user);
    const data: Partial<Genre> = { ...dto };
    return this.prisma.genre.update({ where: { id }, data });
  }

  async remove(id: string, user: User) {
    isAdmin(user);
    await this.prisma.genre.delete({ where: { id } });
    return { message: 'Genre successfully deleted!' };
  }
}
