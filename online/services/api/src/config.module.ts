import databaseConfig from './database/config/database.config';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [databaseConfig, appConfig],
  envFilePath: ['./.env.prod'],
});
