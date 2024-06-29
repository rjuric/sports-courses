import { Schedule } from './schedule.entity';
import { DefaultEntity } from '../../util/entities/default.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Class extends DefaultEntity {
  @Column()
  sport: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @OneToMany(() => Schedule, (schedule) => schedule.class, {
    cascade: true,
  })
  schedule: Schedule[];

  @ManyToMany(() => User, (user) => user.classes)
  users: User[];
}
