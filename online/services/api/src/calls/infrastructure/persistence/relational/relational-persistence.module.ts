import { Module } from '@nestjs/common';
import { CallRepository } from '../call.repository';
import { CallRelationalRepository } from './repositories/call.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallEntity } from './entities/call.entity';
import { CategoryEntity } from '../../../../categories/infrastructure/persistence/relational/entities/category.entity';
import { RelationalCategoryPersistenceModule } from '../../../../categories/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallEntity, CategoryEntity]),
    RelationalCategoryPersistenceModule,
  ],
  providers: [
    {
      provide: CallRepository,
      useClass: CallRelationalRepository,
    },
  ],
  exports: [CallRepository],
})
export class RelationalCallPersistenceModule {}
