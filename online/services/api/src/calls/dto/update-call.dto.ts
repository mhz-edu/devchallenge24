import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/domain/category';

export class UpdateCallDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  text: string;

  @ApiProperty()
  @IsString()
  emotional_tone: string;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  categories: Category[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
}
