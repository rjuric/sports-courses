import { DefaultEntity } from '../../util/default.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Tokens } from '../../auth/entities/tokens.entity';
import { Class } from '../../classes/entities/class.entity';

@Entity()
export class User extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToOne(() => Tokens, { cascade: true })
  @JoinColumn()
  tokens: Tokens;

  @ManyToMany(() => Class)
  @JoinTable()
  classes: Class[];
}
