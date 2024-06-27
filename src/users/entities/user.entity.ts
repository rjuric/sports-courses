import { DefaultEntity } from '../../util/default.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Tokens } from '../../auth/entities/tokens.entity';

@Entity()
export class User extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Tokens)
  @JoinColumn()
  tokens: Tokens;
}
