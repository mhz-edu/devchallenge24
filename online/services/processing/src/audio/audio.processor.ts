import {
  InjectQueue,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Processor('audio')
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);
  constructor(
    @InjectQueue('audio') private readonly audioQueue: Queue,
    @InjectQueue('nlp') private readonly nlpQueue: Queue,
  ) {}

  @OnQueueCompleted()
  async onAudioCompleted(job) {
    this.logger.debug(`Event handler ${job.id}`);
    console.log(
      '(Local) on completed: job ',
      job.id,
      ' -> result: ',
      job.returnvalue,
    );
    await this.nlpQueue.add('transcode', job.returnvalue);
  }

  @Process('transcode')
  async handleTranscode(job: Job) {
    this.logger.debug(job.data);
    const { file_url:fileUrl, id:callId } = job.data;
    let response: Response;
    //Download the file
    try {
      this.logger.debug('Getting the file');
      const fileResponse = await fetch(fileUrl) 
      this.logger.debug(`Getting the file - ${fileResponse.status}`);
      const file = await fileResponse.blob();
      this.logger.debug(`File size ${file.size}`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('response_format', 'json');

      this.logger.debug('Sending the file to whisper');
      response = await fetch(process.env.WHISPER_URL, {
        method: 'post',
        body: formData,
      });
    } catch (err) {
      throw new Error(err);
    }
    this.logger.debug('Transcoding completed\n');
    // this.logger.debug(await (response.json()));
    return { transcodedText: (await response.json()).text, callId };
  }
}
