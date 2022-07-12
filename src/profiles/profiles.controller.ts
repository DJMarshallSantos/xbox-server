import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoggedUser } from 'src/utils/logged-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { addGameDto } from './dto/add-game.dto';
import { UpdateProfileGameDto } from './dto/update-game.dto';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({
    summary: 'Create a Profile',
  })
  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @LoggedUser() user: User) {
    createProfileDto.userId = user.id;
    return this.profilesService.create(createProfileDto);
  }

  @ApiOperation({
    summary: 'Get a list of all Profiles from the database',
  })
  @Get(':skip')
  findAll(@Param('skip') skip: number) {
    return this.profilesService.findAll(+skip);
  }

  @ApiOperation({
    summary: 'Get a Profile by ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Use to update partial or total a Profile by ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @ApiOperation({
    summary: 'Remove a Profile by ID',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }

  @ApiOperation({
    summary: "Add a game/s to user's profile",
  })
  @Post('/addGame')
  addGame(@Body() addGame: addGameDto) {
    return this.profilesService.addGame(addGame);
  }

  @ApiOperation({
    summary: "Update a game/s to user's profile",
  })
  @Patch('/updateGame')
  updateGame(@Body() updateGameDto: UpdateProfileGameDto) {
    return this.profilesService.updateGame(updateGameDto);
  }

  @ApiOperation({
    summary: 'Get a list of all games with a profile ID',
  })
  @Get('/listGames/:id')
  listGames(@Param('id') id: string) {
    return this.profilesService.listGames(id);
  }

  @ApiOperation({
    summary: 'Delete a game by Id from a profile',
  })
  @Delete('/deleteGame/:id')
  deleteGame(@Param('id') id: string) {
    return this.profilesService.deleteGame(id);
  }
}
