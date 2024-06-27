import { Schedule } from './schedule.entity';
import { User } from '../../users/entities/user.entity';
import { DefaultEntity } from '../../util/default.entity';
import { Column } from 'typeorm';

export class Class extends DefaultEntity {
  @Column()
  sport: string;

  @Column()
  duration: number;

  @Column()
  weekSchedule: Schedule[];

  students: User[];
}
