import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'category',
})
export class CategoryEntity extends EntityRelationalHelper {
  @ApiProperty()
  @Column({ type: 'json' })
  points: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;
}
