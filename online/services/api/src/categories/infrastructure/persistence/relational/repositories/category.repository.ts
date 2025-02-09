import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Category } from '../../../../domain/category';
import { CategoryRepository } from '../../category.repository';
import { CategoryMapper } from '../mappers/category.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CategoryRelationalRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(data: Category): Promise<Category> {
    const persistenceModel = CategoryMapper.toPersistence(data);
    const newEntity = await this.categoryRepository.save(
      this.categoryRepository.create(persistenceModel),
    );
    return CategoryMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    const entities = await this.categoryRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async findAll(): Promise<Category[]> {
    const entities = await this.categoryRepository.find();

    return entities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
    });

    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<Category> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.categoryRepository.save(
      this.categoryRepository.create(
        CategoryMapper.toPersistence({
          ...CategoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CategoryMapper.toDomain(updatedEntity);
  }

  async remove(id: Category['id']): Promise<void> {
    const entityExists = await this.categoryRepository.exists({
      where: { id },
    });

    if (!entityExists) {
      throw new Error('Record not found');
    }
    await this.categoryRepository.delete(id);
  }
}
