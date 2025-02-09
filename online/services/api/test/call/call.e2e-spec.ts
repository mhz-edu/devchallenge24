import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../../src/database/config/database.config';
import appConfig from '../../src/config/app.config';
import { configModule } from '../../src/config.module';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from '../../src/utils/validation-options';

describe('Call API Endpoints', () => {
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

  test('POST /call - should create a new call with valid audio URL', async () => {
    const validAudioUrl = { audio_url: 'http://example.com/audiofile.wav' };
    const response = await request(app).post('/call').send(validAudioUrl);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
      }),
    );
  });

  test('POST /call - should return 422 for invalid audio URL', async () => {
    const invalidAudioUrl = { audio_url: 'invalid_url' };
    const response = await request(app).post('/call').send(invalidAudioUrl);
    expect(response.status).toBe(422);
  });

  test('GET /call/{id} - should return 202 if processing is not complete', async () => {
    const validAudioUrl = { audio_url: 'http://example.com/audiofile.wav' };
    const createResponse = await request(app).post('/call').send(validAudioUrl);
    const createdCallId = createResponse.body.id;

    const response = await request(app).get(`/call/${createdCallId}`);
    expect(response.status).toBe(202);
  });

  test('PATCH /call/{id} - should update created call', async () => {
    const fileName = 'audiofile.wav';
    const validAudioUrl = { audio_url: `http://example.com/${fileName}` };
    const transcodedText = 'Test text';
    const emotionalTone = 'Positive';
    const categoryTitle = 'Test title';

    const response = await request(app).post('/call').send(validAudioUrl);
    expect(response.status).toBe(201);
    const createdCallId = response.body.id;

    const createCategoryResponse = await request(app)
      .post('/category')
      .send({
        title: categoryTitle,
        points: ['Topic point'],
      });
    const categoryId = createCategoryResponse.body.id;

    const patchResponse = await request(app)
      .patch(`/call/${createdCallId}`)
      .send({
        emotional_tone: emotionalTone,
        categories: [{ id: categoryId }],
        text: transcodedText,
      });
    expect(patchResponse.status).toBe(200);

    const getResponse = await request(app).get(`/call/${createdCallId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(
      expect.objectContaining({
        id: createdCallId,
        name: fileName,
        location: null,
        emotional_tone: emotionalTone,
        text: transcodedText,
        categories: expect.arrayContaining([categoryTitle]),
      }),
    );
  });
});
