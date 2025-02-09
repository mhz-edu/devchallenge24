import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { NlpProcessor } from './nlp.processor';
import { NlpComponents } from './nlp.components';
import { NlpController } from './nlp.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'nlp'
    }),
  ],
  controllers: [NlpController],
  providers: [NlpProcessor, NlpComponents],
  exports: [NlpModule, BullModule]
})
export class NlpModule {}
