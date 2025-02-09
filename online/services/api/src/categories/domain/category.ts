import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty()
  points: undefined | string[];

  @ApiProperty()
  title: string;

  @ApiProperty({
    type: Number,
  })
  id: number;
}
