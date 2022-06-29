import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoggedUser } from 'src/utils/logged-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiOperation } from '@nestjs/swagger';

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
  @Get()
  findAll() {
    return this.profilesService.findAll();
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
}
