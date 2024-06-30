import { DefaultEntity } from '../../util/entities/default.entity';
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
import { Exclude } from 'class-transformer';
import { Role } from '../../util/enums/role';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends DefaultEntity {
  constructor(email: string, password: string, tokens?: Tokens) {
    super();
    this.email = email;
    this.password = password;
    this.tokens = tokens;
  }

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ type: 'enum', enum: Role, default: [Role.USER] })
  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];

  @ApiProperty()
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
