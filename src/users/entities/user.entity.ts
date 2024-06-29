import { DefaultEntity } from '../../util/entities/default.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Tokens } from '../../auth/entities/tokens.entity';
import { Class } from '../../classes/entities/class.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../util/enums/role';

@Entity()
export class User extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];

  @OneToOne(() => Tokens, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  tokens?: Tokens;

  @ManyToMany(() => Class)
  @JoinTable()
  classes: Class[];
}
