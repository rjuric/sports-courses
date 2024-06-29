import { Schedule } from './schedule.entity';
import { DefaultEntity } from '../../util/entities/default.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Class extends DefaultEntity {
  @ApiProperty()
  @Column()
  sport: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  duration: number;

  @ApiProperty({ type: Schedule, isArray: true })
  @OneToMany(() => Schedule, (schedule) => schedule.class, {
    cascade: true,
  })
  schedule: Schedule[];

  @ManyToMany(() => User, (user) => user.classes)
  users: User[];
}
