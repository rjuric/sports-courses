import { Schedule } from './schedule.entity';
import { DefaultEntity } from '../../util/default.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Class extends DefaultEntity {
  @Column()
  sport: string;

  @Column()
  duration: number;

  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedule: Schedule[];

  @ManyToMany(() => User, (user) => user.classes)
  users: User[];
}
