import { Injectable } from '@nestjs/common';
import { Prisma, ProfileGame } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleError } from 'src/utils/handle-error.util';
import { addGameDto } from './dto/add-game.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileGameDto } from './dto/update-game.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProfileDto) {
    const data: Prisma.ProfileCreateInput = {
      title: dto.title,
      imageURL: dto.imageURL,
      user: {
        connect: {
          id: dto.userId,
        },
      },
    };
    return this.prisma.profile.create({ data }).catch(handleError);
  }

  async findAll(skip: number) {
    const profileList = await this.prisma.profile.findMany({
      skip: skip,
      take: 10,
      orderBy: {
        title: 'asc',
      },
    });
    if (profileList.length == 0) {
      return { message: 'No profiles in the records' };
    } else {
      return profileList;
    }
  }

  findOne(id: string) {
    return this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  update(id: string, dto: UpdateProfileDto) {
    const data: Partial<Profile> = { ...dto };
    return this.prisma.profile
      .update({
        where: { id },
        data,
      })
      .catch(handleError);
  }

  async remove(id: string) {
    await this.prisma.profile.delete({ where: { id } });
    return { message: 'Profile successfully deleted' };
  }

  addGame(addGame: addGameDto) {
    const transactions = addGame.games.map((game) =>
      this.prisma.profileGame.create({
        data: {
          profile: {
            connect: {
              id: addGame.profile,
            },
          },
          game: { connect: { id: game.id } },
          favorite: game.fav,
          imdbScore: game.imdb,
        },
      }),
    );
    return this.prisma.$transaction(transactions);
  }

  updateGame(updateGameDto: UpdateProfileGameDto) {
    const data: Partial<ProfileGame> = { ...updateGameDto };
    return this.prisma.profileGame.update({
      where: { id: updateGameDto.id },
      data,
    });
  }

  listGames(id: string) {
    return this.prisma.profileGame
      .findMany({
        where: { profileId: id },
        select: {
          id: true,
          favorite: true,
          imdbScore: true,
          game: {
            select: {
              id: true,
              title: true,
              coverImageURL: true,
              description: true,
            },
          },
        },
      })
      .catch(handleError);
  }

  async deleteGame(id: string) {
    await this.prisma.profileGame.delete({ where: { id } });
    return { message: 'Game successfully removed from profile' };
  }
}
