import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';

export class UpdateProfileGameDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'A ProfileGame UUID',
    example: 'c1c8fae3-d8a1-462b-ba24-50b17900a6dc',
  })
  id?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'A Game UUID',
    example: 'c1c8fae3-d8a1-462b-ba24-50b17900a6dc',
  })
  gameId?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether it is a favorite game or not',
    example: true,
  })
  favorite?: boolean;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'An IMDB score (integer only)',
    example: 3,
  })
  imdbScore?: number;
}
