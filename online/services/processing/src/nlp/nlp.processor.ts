import {
  InjectQueue,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { NlpComponents } from './nlp.components';

@Processor('nlp')
export class NlpProcessor {
  private readonly logger = new Logger(NlpProcessor.name);
  constructor(
    @InjectQueue('nlp') private readonly nlpQueue: Queue,
    private nlpComponents: NlpComponents,
  ) {}

  @OnQueueCompleted()
  async onNlpCompleted(job) {
    this.logger.debug(`Event handler ${job.id}`);
    console.log(
      '(Local) on completed: job ',
      job.id,
      ' -> result: ',
      job.returnvalue,
    );
  }

  @Process('transcode')
  async handleTranscode(job: Job) {
    const sentimentMapping = (value) => {
      if (value > 0.3) {
        return 'Positive';
      } else if (value < 0) {
        return 'Negative';
      } else {
        return 'Neutral';
      }
    };
    const { transcodedText: text, callId } = job.data;
    this.logger.debug(`Text received ${text}`);

    const classifications =
      this.nlpComponents.classifier.getClassifications(text);
    const category = classifications.reduce((maximum, current) =>
      current.value > maximum.value ? current : maximum,
    );
    this.logger.debug(`Classify ${JSON.stringify(category)}`);
    const sentimentVal = this.nlpComponents.analyzer.getSentiment(
      text.split(' '),
    );
    this.logger.debug(`Sentiment ${sentimentMapping(sentimentVal)}`);

    this.logger.debug(
      `Sending PATCH request to ${process.env.API_URL}/call/ for ${callId}`,
    );
    const response = await fetch(`${process.env.API_URL}/call/${callId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emotional_tone: sentimentMapping(sentimentVal),
        categories: [{ id: parseInt(category.label) }],
        text
      }),
    });
    this.logger.debug(`Response ${response.status}`);

    return {
      text,
      sentiment: sentimentMapping(sentimentVal),
      categories: [{ id: parseInt(category.label) }],
    };
  }
}
