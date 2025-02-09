import { Injectable, Logger } from '@nestjs/common';
import { BayesClassifier, PorterStemmer, SentimentAnalyzer } from 'natural';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class NlpComponents {
  private readonly logger = new Logger(NlpComponents.name);
  classifier: BayesClassifier
  analyzer: SentimentAnalyzer

  constructor() {
    this.logger.debug(`path ${path.join(__dirname, '..', '..', 'model.json')}`);
    const file = fs
      .readFileSync(path.join(__dirname, '..', '..', 'model.json'))
      .toString();
    this.classifier = BayesClassifier.restore(JSON.parse(file));

    this.analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

    this.classifier.on('trainedWithDocument', (data)=>{
        this.logger.debug('Training', data)
    })

    this.classifier.on('doneTraining', (data)=>{
        this.logger.debug('Training completed', data)
    })
  }
}
