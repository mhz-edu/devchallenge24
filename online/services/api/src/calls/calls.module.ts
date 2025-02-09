import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { RelationalCallPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCallPersistenceModule],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService, RelationalCallPersistenceModule],
})
export class CallsModule {}
