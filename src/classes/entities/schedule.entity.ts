import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../util/entities/default.entity';
import { Class } from './class.entity';
import { DayOfWeek } from '../../util/enums/day-of.week';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Schedule extends DefaultEntity {
  @ApiProperty()
  @Column({ type: 'time' })
  time: string;

  @ApiProperty({ type: 'enum', enum: DayOfWeek })
  @Column()
  day: DayOfWeek;

  @ManyToOne(() => Class, (c) => c.schedule, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  class: Class;
}
