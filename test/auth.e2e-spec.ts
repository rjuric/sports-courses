import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('sign up', () => {
    it('throws 400 on invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'not_an_email', password: 'strong_password' });

      expect(response.status).toBe(400);
    });

    it('throws 400 on invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'invalid' });

      expect(response.status).toBe(400);
    });

    it('throws 400 on missing properties', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({});

      expect(response.status).toBe(400);
    });

    it('throws 400 on email already in use', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      expect(response.status).toBe(400);
    });

    it('returns user and 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const { status, body } = response;
      const { email, id, tokens, roles } = body;
      const { accessToken, refreshToken, id: tokenId } = tokens;

      expect(status).toBe(201);
      expect(email).toStrictEqual('test@test.com');
      expect(id).toBeDefined();
      expect(roles).toStrictEqual(['USER']);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(tokenId).toBeDefined();
    });
  });

  describe('sign in', () => {
    it('throws 400 on invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: 'not_an_email', password: 'strong_password' });

      expect(response.status).toBe(400);
    });

    it('throws 400 on email not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: 'test@email.com', password: 'strong_password' });

      expect(response.status).toBe(400);
    });

    it('throws 400 on passwords not matching', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: 'test@email.com', password: 'stronger_password' });

      expect(response.status).toBe(400);
    });

    it('returns user on 201', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const { status, body } = response;
      const { email, id, tokens, roles } = body;
      const { accessToken, refreshToken, id: tokenId } = tokens;

      expect(status).toBe(200);
      expect(email).toStrictEqual('test@test.com');
      expect(id).toBeDefined();
      expect(roles).toStrictEqual(['USER']);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(tokenId).toBeDefined();
    });
  });

  describe('sign out', () => {
    it('throws 401 on invalid token', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-out')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });

    it('returns 204 on valid token', async () => {
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-out')
        .set(
          'Authorization',
          `Bearer ${signInResponse.body.tokens.accessToken}`,
        );

      expect(response.status).toBe(204);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('refresh', () => {
    it('throws 401 on no token', async () => {
      const response = await request(app.getHttpServer()).post('/auth/refresh');

      expect(response.status).toBe(401);
    });

    it('throws 401 on invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });

    it('returns 200 on valid token', async () => {
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set(
          'Authorization',
          `Bearer ${signInResponse.body.tokens.refreshToken}`,
        );

      const { status, body } = response;
      const { accessToken, refreshToken, id } = body;

      expect(status).toBe(200);
      expect(id).toBeDefined();
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });
  });
});
