import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ClassesService } from '../src/classes/classes.service';
import {
  CreateClassDto,
  CreateClassScheduleDto,
} from '../src/classes/dto/create-class.dto';
import { DayOfWeek } from '../src/util/enums/day-of.week';
import * as request from 'supertest';
import { User } from '../src/users/entities/user.entity';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

const footballDto = new CreateClassDto(
  'football',
  'a sport where the ball is kicked',
  90,
  [new CreateClassScheduleDto(DayOfWeek.MONDAY, '18:00:00')],
);

const basketballDto = new CreateClassDto(
  'basketball',
  'a sport where the ball is bounced',
  90,
  [new CreateClassScheduleDto(DayOfWeek.MONDAY, '18:00:00')],
);

const tennisDto = new CreateClassDto(
  'tennis',
  'a sport where the small ball is bounced',
  90,
  [new CreateClassScheduleDto(DayOfWeek.MONDAY, '18:00:00')],
);

describe('Classes (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('find', () => {
    beforeEach(async () => {
      const classesService = app.get(ClassesService);

      await classesService.create(footballDto);
      await classesService.create(basketballDto);
    });

    it('returns 200 and all classes when no sports are passed', async () => {
      const { body, statusCode } = await request(app.getHttpServer()).get(
        '/classes',
      );

      expect(statusCode).toBe(200);
      expect(body).toBeDefined();
      expect(body.length).toStrictEqual(2);
    });

    it('returns 200 and no classes when sport not found', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .get('/classes')
        .query({ sports: 'tennis' });

      expect(statusCode).toBe(200);
      expect(body).toBeDefined();
      expect(body.length).toStrictEqual(0);
    });

    it('returns 200', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .get('/classes')
        .query({ sports: 'football,basketball,tennis' });

      expect(statusCode).toBe(200);
      expect(body).toBeDefined();
      expect(body.length).toStrictEqual(2);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      const classesService = app.get(ClassesService);

      await classesService.create(footballDto);
      await classesService.create(basketballDto);
    });

    it('throws 400 when id not integer', async () => {
      const { statusCode } = await request(app.getHttpServer()).get(
        '/classes/one',
      );

      const { statusCode: statusCode2 } = await request(
        app.getHttpServer(),
      ).get('/classes/3.2');

      expect(statusCode).toBe(400);
      expect(statusCode2).toBe(400);
    });

    it('throws 404 when not found', async () => {
      const { statusCode } = await request(app.getHttpServer()).get(
        '/classes/3',
      );

      expect(statusCode).toBe(404);
    });

    it('returns 200', async () => {
      const { statusCode, body } = await request(app.getHttpServer()).get(
        '/classes/1',
      );

      expect(statusCode).toBe(200);
      expect(body).toBeDefined();
      expect(body.sport).toStrictEqual('football');
    });
  });

  describe('apply', () => {
    let user: User;

    beforeEach(async () => {
      const classesService = app.get(ClassesService);

      await classesService.create(footballDto);
      await classesService.create(basketballDto);

      const authService = app.get(AuthService);

      user = (await authService.signUp({
        email: 'admin@admin.com',
        password: 'strong_password',
      }))!;
    });

    it('throws 401 when invalid token', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post('/classes/1/apply')
        .set('Authorization', 'Bearer invalid_token')
        .send({ isApplied: true });

      expect(statusCode).toBe(401);
    });

    it('throws 400 when id is not integer', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post('/classes/one/apply')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ isApplied: true });

      const { statusCode: statusCode2 } = await request(app.getHttpServer())
        .post('/classes/one/apply')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ isApplied: true });

      expect(statusCode).toBe(400);
      expect(statusCode2).toBe(400);
    });

    it('throws 404 when class not found', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post('/classes/3/apply')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ isApplied: true });

      expect(statusCode).toBe(404);
    });

    it('returns 204 on application', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post('/classes/1/apply')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ isApplied: true });

      expect(statusCode).toBe(204);
    });

    it('returns 204 on removing application', async () => {
      await request(app.getHttpServer())
        .post('/classes/3/apply')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ isApplied: true });

      const { statusCode } = await request(app.getHttpServer())
        .post('/classes/1/apply')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ isApplied: false });

      expect(statusCode).toBe(204);
    });
  });

  describe('create', () => {
    let user: User;

    beforeEach(async () => {
      const classesService = app.get(ClassesService);

      await classesService.create(footballDto);
      await classesService.create(basketballDto);

      const authService = app.get(AuthService);

      user = (await authService.signUp({
        email: 'admin@admin.com',
        password: 'strong_password',
      }))!;
    });

    it('throws 401 when invalid token', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', 'Bearer invalid_token')
        .send(tennisDto);

      expect(statusCode).toBe(401);
    });

    it('throws 403 when invalid role', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send(tennisDto);

      expect(statusCode).toBe(403);
    });

    it('returns 201', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(1);

      const { statusCode, body } = await request(app.getHttpServer())
        .post('/classes')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send(tennisDto);

      expect(statusCode).toBe(201);
      expect(body).toBeDefined();
    });
  });

  describe('update', () => {
    let user: User;

    beforeEach(async () => {
      const classesService = app.get(ClassesService);

      await classesService.create(footballDto);
      await classesService.create(basketballDto);

      const authService = app.get(AuthService);

      user = (await authService.signUp({
        email: 'admin@admin.com',
        password: 'strong_password',
      }))!;
    });

    it('throws 401 when invalid token', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .patch('/classes/1')
        .set('Authorization', 'Bearer invalid_token')
        .send({ duration: 60 });

      expect(statusCode).toBe(401);
    });

    it('throws 403 when invalid role', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .patch('/classes/1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ duration: 60 });

      expect(statusCode).toBe(403);
    });

    it('throws 400 when id not integer', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/classes/one')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ duration: 30 });

      const { statusCode: statusCode2 } = await request(app.getHttpServer())
        .patch('/classes/1.1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ duration: 30 });

      expect(statusCode).toBe(400);
      expect(statusCode2).toBe(400);
    });

    it('throws 404 when class not found', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/classes/3')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ duration: 30 });

      expect(statusCode).toBe(400);
    });

    it('throws 400 when invalid Dto', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode } = await request(app.getHttpServer())
        .patch('/classes/1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({ duration: 30 });

      expect(statusCode).toBe(400);
    });

    it('returns 200', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode, body } = await request(app.getHttpServer())
        .patch('/classes/1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`)
        .send({
          duration: 123,
          schedule: [
            { day: DayOfWeek.MONDAY, time: '8:00' },
            { day: DayOfWeek.SUNDAY, time: '8:00' },
          ],
        });

      const { duration, schedule } = body;
      const [lecture1, lecture2] = schedule;

      expect(statusCode).toBe(200);
      expect(duration).toStrictEqual(123);
      expect(lecture1).toBeDefined();
      expect(lecture2).toBeDefined();
      expect({ day: lecture1.day, time: lecture1.time }).toEqual({
        day: DayOfWeek.MONDAY,
        time: '8:00',
      });
      expect({ day: lecture2.day, time: lecture2.time }).toEqual({
        day: DayOfWeek.SUNDAY,
        time: '8:00',
      });
    });
  });

  describe('remove', () => {
    let user: User;

    beforeEach(async () => {
      const classesService = app.get(ClassesService);

      await classesService.create(footballDto);
      await classesService.create(basketballDto);

      const authService = app.get(AuthService);

      user = (await authService.signUp({
        email: 'admin@admin.com',
        password: 'strong_password',
      }))!;
    });

    it('throws 401 when invalid token', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .delete('/classes/1')
        .set('Authorization', 'Bearer invalid_token');

      expect(statusCode).toBe(401);
    });

    it('throws 403 when invalid role', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .delete('/classes/1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`);

      expect(statusCode).toBe(403);
    });

    it('throws 400 when id not integer', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode } = await request(app.getHttpServer())
        .delete('/classes/three')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`);

      const { statusCode: statusCode2 } = await request(app.getHttpServer())
        .delete('/classes/3.1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`);

      expect(statusCode).toBe(400);
      expect(statusCode2).toBe(400);
    });

    it('throws 404 when class not found', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode } = await request(app.getHttpServer())
        .delete('/classes/3')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`);

      expect(statusCode).toBe(404);
    });

    it('returns 204', async () => {
      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode } = await request(app.getHttpServer())
        .delete('/classes/1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`);

      const { statusCode: statusCode2 } = await request(
        app.getHttpServer(),
      ).get('/classes/1');

      expect(statusCode).toBe(204);
      expect(statusCode2).toBe(404);
    });

    it('user applied to deleted class still exists', async () => {
      const { body: appliedUser } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ email: 'test@test.com', password: 'strong_password' });
      await request(app.getHttpServer())
        .post('/classes/1/apply')
        .set('Authorization', `Bearer ${appliedUser.tokens?.accessToken}`)
        .send({ isApplied: true });

      const usersService = app.get(UsersService);
      await usersService.testMakeAdmin(user.id);

      const { statusCode } = await request(app.getHttpServer())
        .delete('/classes/1')
        .set('Authorization', `Bearer ${user.tokens?.accessToken}`);

      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: 'test@test.com', password: 'strong_password' });

      expect(statusCode).toBe(204);
      expect(signInResponse.statusCode).toBe(200);
    });
  });
});
