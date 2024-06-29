import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../util/entities/default.entity';
import { Class } from './class.entity';
import { DayOfWeekEnum } from '../../util/enums/day-of-week.enum';

@Entity()
export class Schedule extends DefaultEntity {
  @Column({ type: 'time' })
  time: string;

  @Column()
  day: DayOfWeekEnum;

  @ManyToOne(() => Class, (c) => c.schedule, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class: Class;
}
