import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../util/default.entity';
import { Class } from './class.entity';
import { DayOfWeek } from '../../util/day-of-week';

@Entity()
export class Schedule extends DefaultEntity {
  @Column({ type: 'time' })
  time: string;

  @Column()
  day: DayOfWeek;

  @ManyToOne(() => Class, (c) => c.schedule, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class: Class;
}
