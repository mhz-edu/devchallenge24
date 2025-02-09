import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';

@Entity({
  name: 'call',
})
export class CallEntity extends EntityRelationalHelper {
  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  categories: CategoryEntity[];

  @ApiProperty()
  @Column({ nullable: true })
  text: string;

  @ApiProperty()
  @Column({ nullable: true })
  emotional_tone: string;

  @ApiProperty()
  @Column({ nullable: true })
  location: string;

  @ApiProperty()
  @Column({ default: false })
  analysed: boolean;

  @ApiProperty()
  @Column({ default: false })
  transcribed: boolean;

  @ApiProperty()
  @Column()
  audio_url: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;
}
