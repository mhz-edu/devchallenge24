import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/domain/category';

export class Call {
  @ApiProperty()
  text: string;

  @ApiProperty()
  categories: Category[];

  @ApiProperty()
  emotional_tone: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  analysed: boolean;

  @ApiProperty()
  transcribed: boolean;

  @ApiProperty()
  audio_url: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    type: Number,
  })
  id: number;
}
