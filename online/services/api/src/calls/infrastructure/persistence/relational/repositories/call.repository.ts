import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallEntity } from '../entities/call.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Call } from '../../../../domain/call';
import { CallRepository } from '../../call.repository';
import { CallMapper } from '../mappers/call.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Category } from '../../../../../categories/domain/category';
import { CategoryRepository } from '../../../../../categories/infrastructure/persistence/category.repository';

@Injectable()
export class CallRelationalRepository implements CallRepository {
  private readonly logger = new Logger(CallRelationalRepository.name);
  constructor(
    @InjectRepository(CallEntity)
    private readonly callRepository: Repository<CallEntity>,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(data: Call): Promise<Call> {
    const parsedUrl = new URL(data.audio_url);
    data.categories = [];

    const persistenceModel = CallMapper.toPersistence(data);
    persistenceModel.name = path.basename(parsedUrl.pathname);
    const newEntity = await this.callRepository.save(
      this.callRepository.create(persistenceModel),
    );
    return CallMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Call[]> {
    const entities = await this.callRepository.find({
      relations: {
        categories: true,
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CallMapper.toDomain(entity));
  }

  async findById(id: Call['id']): Promise<NullableType<Call>> {
    const entity = await this.callRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });

    return entity ? CallMapper.toDomain(entity) : null;
  }

  async update(
    id: Call['id'],
    payload: Partial<Omit<Call, 'categories'>> & {
      categories: Category[];
    },
  ): Promise<Call> {
    const entity = await this.callRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    this.logger.debug(`Found entity ${JSON.stringify(entity)}`);
    this.logger.debug(`Payload ${JSON.stringify(payload)}`);

    const categories = await Promise.all(
      payload.categories?.map(async (category) => {
        const cat = await this.categoryRepository.findById(category.id);
        if (!cat) {
          throw new Error('Category not found');
        }
        return cat;
      }),
    );

    const updatedEntity = await this.callRepository.save(
      this.callRepository.create(
        CallMapper.toPersistence({
          ...CallMapper.toDomain(entity),
          ...payload,
          categories,
        }),
      ),
    );

    return CallMapper.toDomain(updatedEntity);
  }

  async remove(id: Call['id']): Promise<void> {
    await this.callRepository.delete(id);
  }
}
