import { CategoryMapper } from '../../../../../categories/infrastructure/persistence/relational/mappers/category.mapper';
import { Call } from '../../../../domain/call';
import { CallEntity } from '../entities/call.entity';

export class CallMapper {
  static toDomain(raw: CallEntity): Call {
    const domainEntity = new Call();
    domainEntity.text = raw.text;
    domainEntity.emotional_tone = raw.emotional_tone;
    domainEntity.location = raw.location;
    domainEntity.analysed = raw.analysed;
    domainEntity.transcribed = raw.transcribed;
    domainEntity.audio_url = raw.audio_url;
    domainEntity.name = raw.name;
    domainEntity.id = raw.id;
    domainEntity.categories = raw.categories.map((category) =>
      CategoryMapper.toDomain(category),
    );
    return domainEntity;
  }

  static toPersistence(domainEntity: Call): CallEntity {
    const persistenceEntity = new CallEntity();
    persistenceEntity.text = domainEntity.text;
    persistenceEntity.emotional_tone = domainEntity.emotional_tone;
    persistenceEntity.location = domainEntity.location;
    persistenceEntity.analysed = domainEntity.analysed;
    persistenceEntity.transcribed = domainEntity.transcribed;
    persistenceEntity.audio_url = domainEntity.audio_url;
    persistenceEntity.name = domainEntity.name;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.categories = domainEntity.categories.map((category) =>
      CategoryMapper.toPersistence(category),
    );

    return persistenceEntity;
  }

  static toResponse(call: Call): Omit<
    Call,
    'analysed' | 'transcribed' | 'categories' | 'audio_url'
  > & {
    categories: string[];
  } {
    const { id, name, location, emotional_tone, text, categories } = call;
    const categoryTitles = categories.map((category) => category.title);
    return {
      id,
      name,
      location,
      emotional_tone,
      text,
      categories: categoryTitles,
    };
  }
}
