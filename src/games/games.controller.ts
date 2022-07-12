import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { LoggedUser } from 'src/utils/logged-user.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('game')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({
    summary: 'Create a Game',
  })
  @Post()
  create(@Body() createGameDto: CreateGameDto, @LoggedUser() user: User) {
    return this.gamesService.create(createGameDto, user);
  }

  @ApiOperation({
    summary: 'Get a list of all Games from the database',
  })
  @Get(':skip')
  findAll(@Param('skip') skip: number) {
    return this.gamesService.findAll(+skip);
  }

  @ApiOperation({
    summary: 'Get a Game by ID',
  })
  @ApiOperation({
    summary: 'Get a list of all favorite games by profile from database',
  })
  @Get('/favorites/:id')
  findAllFavorites(@Param('id') id: string) {
    return this.gamesService.findAllFavorites(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Use to update partial or total a Game by ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
    @LoggedUser() user: User,
  ) {
    return this.gamesService.update(id, updateGameDto, user);
  }

  @ApiOperation({
    summary: 'Remove a Game by ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @LoggedUser() user: User) {
    return this.gamesService.remove(id, user);
  }
}
