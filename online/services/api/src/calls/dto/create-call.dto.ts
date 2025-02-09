import { IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCallDto {
  @ApiProperty()
  @IsUrl()
  audio_url: string;
}
