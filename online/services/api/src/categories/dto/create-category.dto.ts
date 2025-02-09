import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString({ each: true })
  points: string[];

  @ApiProperty()
  @IsString()
  title: string;
}
