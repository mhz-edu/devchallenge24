import {
    InjectQueue,
  } from '@nestjs/bull';
  import { Body, Controller, Post, Logger } from '@nestjs/common';
  import { Queue } from 'bull';
import { NlpComponents } from './nlp.components';
  
  @Controller('nlp')
  export class NlpController {
    private readonly logger = new Logger(NlpController.name);
    constructor(
      @InjectQueue('nlp') private readonly nlpQueue: Queue,
      private nlpComponents: NlpComponents
    ) {}
  
    @Post('transcode')
    async transcode(@Body() body) {
      await this.nlpQueue.add('transcode', body);
    }

    @Post('doc')
    async addDoc(@Body() body) {
        this.logger.debug('Doc management', body)
        const {add, remove} = body
        if (add) {
            const {title, points} = add
            this.logger.debug(`Adding ${title} with points ${points}`)
            this.nlpComponents.classifier.addDocument(points, title)
            this.nlpComponents.classifier.retrain()
        } else if (remove) {
            const {title, points} = remove
            this.logger.debug(`Removing ${title} with points ${points}`)
            this.nlpComponents.classifier.removeDocument(points, title)
            this.nlpComponents.classifier.retrain()
        }
    }
  }
  