import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  imports: [UsersModule, TypeOrmModule.forFeature([Class])],
})
export class ClassesModule {}
