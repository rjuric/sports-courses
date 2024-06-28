import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../util/default.entity';
import { Class } from './class.entity';

@Entity()
export class Schedule extends DefaultEntity {
  @Column({ type: 'time' })
  timeOnly: string;

  @Column({ type: 'date' })
  dateOnly: string;

  @ManyToOne(() => Class, (c) => c.schedule)
  class: Class;
}
