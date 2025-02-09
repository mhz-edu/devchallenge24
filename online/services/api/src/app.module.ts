import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CategoriesModule } from './categories/categories.module';
import { CallsModule } from './calls/calls.module';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions.js';
import { configModule } from './config.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,

  dataSourceFactory: async (options: DataSourceOptions) => {
    console.log(
      '------------DB HOST: ',
      (options as PostgresConnectionCredentialsOptions).host,
    );
    return new DataSource(options).initialize();
  },
});

@Module({
  imports: [
    configModule,
    infrastructureDatabaseModule,
    CallsModule,
    CategoriesModule,
    HomeModule,
  ],
})
export class AppModule {}
