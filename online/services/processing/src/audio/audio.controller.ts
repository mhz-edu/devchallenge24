import {
  InjectQueue,
} from '@nestjs/bull';
import { Body, Controller, Post, Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('audio')
export class AudioController {
  private readonly logger = new Logger(AudioController.name);
  constructor(
    @InjectQueue('audio') private readonly audioQueue: Queue
  ) {}

  @Post('transcode')
  async transcode(@Body() body) {
    await this.audioQueue.add('transcode', body);
  }
}
