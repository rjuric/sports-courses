import { Schedule } from './schedule.entity';
import { User } from '../../users/entities/user.entity';

export class Class {
  id: number;

  sport: string;

  duration: number;

  weekSchedule: Schedule[]

  students: User[]
}
