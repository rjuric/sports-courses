import { Column, Entity, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../util/entities/default.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Tokens extends DefaultEntity {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @OneToOne(() => User, (user) => user.tokens)
  user: User;
}
