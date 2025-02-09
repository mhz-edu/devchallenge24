import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { configModule } from '../../src/config.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../../src/database/config/database.config';
import appConfig from '../../src/config/app.config';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from '../../src/utils/validation-options';

describe('Category API Endpoints', () => {
  const nonExistingCategoryId = 9999;
  let app: any;

  beforeAll(async () => {
    delete process.env.DATABASE_HOST;
    delete process.env.DATABASE_NAME;
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(configModule)
      .useModule(
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig, appConfig],
          envFilePath: ['./.env.example'],
          ignoreEnvVars: true,
        }),
      )
      .compile();
    const nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalPipes(new ValidationPipe(validationOptions));
    await nestApp.init();
    app = nestApp.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /category - should return a list of all conversation topics', async () => {
    const response = await request(app).get('/category');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          points: expect.any(Array),
        }),
      ]),
    );
  });

  test('POST /category - should create a new conversation topic', async () => {
    const newCategory = {
      title: 'Topic Title',
      points: ['Key Point 1', 'Key Point 2'],
    };
    const response = await request(app).post('/category').send(newCategory);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: newCategory.title,
        points: newCategory.points,
      }),
    );
  });

  test('POST /category - should return 422 if title is missing', async () => {
    const response = await request(app)
      .post('/category')
      .send({ points: ['Key Point 1'] });

    expect(response.status).toBe(422);
  });

  test('PUT /category/{category_id} - should update an existing conversation topic', async () => {
    const createCategoryResponse = await request(app).post('/category').send({
      title: 'Topic Title',
      points: [],
    });
    const categoryId = createCategoryResponse.body.id;
    const updatedCategory = {
      title: 'New Topic Title',
      points: ['New Key Point 1', 'New Key Point 2'],
    };

    const response = await request(app)
      .put(`/category/${categoryId}`)
      .send(updatedCategory);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: categoryId,
        title: updatedCategory.title,
        points: updatedCategory.points,
      }),
    );
  });

  test('PUT /category/{category_id} - should return 404 for non-existing conversation topic', async () => {
    const updatedCategory = {
      title: 'New Topic Title',
      points: ['New Key Point 1', 'New Key Point 2'],
    };

    const response = await request(app)
      .put(`/category/${nonExistingCategoryId}`)
      .send(updatedCategory);

    expect(response.status).toBe(404);
  });

  test('DELETE /category/{category_id} - should delete a conversation topic', async () => {
    const createCategoryResponse = await request(app).post('/category').send({
      title: 'Topic Title',
      points: [],
    });
    const categoryId = createCategoryResponse.body.id;
    const response = await request(app).delete(`/category/${categoryId}`);

    expect(response.status).toBe(200);
  });

  test('DELETE /category/{category_id} - should return 404 if category not found', async () => {
    const response = await request(app).delete(
      `/category/${nonExistingCategoryId}`,
    );

    expect(response.status).toBe(404);
  });
});
