import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/users/users.service';
import { Role } from '../src/util/enums/role';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = app.get(UsersService);

    await app.init();
  });

  describe('update roles', () => {
    it('throws 403 when caller not admin', async () => {
      const userResponse = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .patch('/users/1/roles')
        .send({ roles: [Role.USER, Role.ADMIN] })
        .set('Authorization', `Bearer ${userResponse.body.tokens.accessToken}`);

      expect(response.status).toBe(403);
    });

    it('throws 404 when user not found', async () => {
      const userResponse = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });
      await usersService.testMakeAdmin(userResponse.body.id);

      const response = await request(app.getHttpServer())
        .patch('/users/2/roles')
        .send({ roles: [Role.USER, Role.ADMIN] })
        .set('Authorization', `Bearer ${userResponse.body.tokens.accessToken}`);

      expect(response.status).toBe(404);
    });

    it('updates roles when user exists', async () => {
      const { body: user1 } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });
      const { body: user2 } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test1@test.com', password: 'strong_password' });
      await usersService.testMakeAdmin(user1.id);

      const response = await request(app.getHttpServer())
        .patch(`/users/${user2.id}/roles`)
        .send({ roles: [Role.USER, Role.ADMIN] })
        .set('Authorization', `Bearer ${user1.tokens.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.roles).toStrictEqual([Role.USER, Role.ADMIN]);
    });
  });

  describe('remove', () => {
    it('get 401 when invalid token is sent', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/1`)
        .send({ roles: [Role.USER, Role.ADMIN] })
        .set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(401);
    });

    it('get 403 when not admin', async () => {
      const { body: user } = await request(app.getHttpServer())
        .post(`/auth/sign-up`)
        .send({ email: 'test@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .delete(`/users/1`)
        .set('Authorization', `Bearer ${user.tokens.accessToken}`);

      expect(response.status).toBe(403);
    });

    it('get 404 when user does not exist', async () => {
      const { body: user } = await request(app.getHttpServer())
        .post(`/auth/sign-up`)
        .send({ email: 'test@test.com', password: 'strong_password' });
      await usersService.testMakeAdmin(user.id);

      const response = await request(app.getHttpServer())
        .delete(`/users/2`)
        .set('Authorization', `Bearer ${user.tokens.accessToken}`);

      expect(response.status).toBe(404);
    });

    it('get 204', async () => {
      const { body: user } = await request(app.getHttpServer())
        .post(`/auth/sign-up`)
        .send({ email: 'test@test.com', password: 'strong_password' });
      await usersService.testMakeAdmin(user.id);

      const { body: userTbd } = await request(app.getHttpServer())
        .post(`/auth/sign-up`)
        .send({ email: 'test1@test.com', password: 'strong_password' });

      const response = await request(app.getHttpServer())
        .delete(`/users/${userTbd.id}`)
        .set('Authorization', `Bearer ${user.tokens.accessToken}`);

      expect(response.status).toBe(204);
    });
  });
});
