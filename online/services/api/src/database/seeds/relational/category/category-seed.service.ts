import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../../categories/infrastructure/persistence/relational/entities/category.entity';
import { categorySeedData } from '../category.data';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(CategoryEntity)
    private repository: Repository<CategoryEntity>,
  ) {}

  async run() {
    await this.repository.save(
      categorySeedData.map(({ title, points }) =>
        this.repository.create({ title, points: JSON.stringify(points) }),
      ),
    );
  }
}
