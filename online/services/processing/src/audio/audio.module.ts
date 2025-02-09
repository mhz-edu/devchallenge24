import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioProcessor } from './audio.processor';
import { NlpModule } from 'src/nlp/nlp.module';

@Module({
  imports: [
    NlpModule,
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  controllers: [AudioController],
  providers: [AudioProcessor],
  exports: [AudioModule, AudioProcessor, BullModule]
})
export class AudioModule {}
