import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Call } from '../../domain/call';

export abstract class CallRepository {
  abstract create(data: Pick<Call, 'audio_url'>): Promise<Call>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Call[]>;

  abstract findById(id: Call['id']): Promise<NullableType<Call>>;

  abstract update(
    id: Call['id'],
    payload: DeepPartial<Call>,
  ): Promise<Call | null>;

  abstract remove(id: Call['id']): Promise<void>;
}
