import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../util/default.entity';

@Entity()
export class Tokens extends DefaultEntity {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}
