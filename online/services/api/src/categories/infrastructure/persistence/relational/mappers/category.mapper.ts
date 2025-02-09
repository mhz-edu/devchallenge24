import { Category } from '../../../../domain/category';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const domainEntity = new Category();
    domainEntity.points = JSON.parse(raw.points) as string[];
    domainEntity.title = raw.title;
    domainEntity.id = raw.id;

    return domainEntity;
  }

  static toPersistence(domainEntity: Category): CategoryEntity {
    const persistenceEntity = new CategoryEntity();
    persistenceEntity.points = domainEntity.points
      ? JSON.stringify(domainEntity.points)
      : '';
    persistenceEntity.title = domainEntity.title;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    return persistenceEntity;
  }
}
