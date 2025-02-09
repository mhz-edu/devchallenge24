import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { CategorySeedService } from './category/category-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(CategorySeedService).run();

  await app.close();
};

void runSeed();
