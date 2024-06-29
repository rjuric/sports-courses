import { Column, Entity, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../util/entities/default.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tokens extends DefaultEntity {
  @ApiProperty()
  @Column()
  accessToken: string;

  @ApiProperty()
  @Column()
  refreshToken: string;

  @OneToOne(() => User, (user) => user.tokens)
  user: User;
}
