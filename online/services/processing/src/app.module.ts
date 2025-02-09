import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common';
import { AudioModule } from './audio/audio.module';
import { NlpModule } from './nlp/nlp.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    NlpModule,
    AudioModule,
  ],
})
export class AppModule {}
