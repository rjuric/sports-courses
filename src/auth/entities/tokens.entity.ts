import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../util/entities/default.entity';

@Entity()
export class Tokens extends DefaultEntity {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}
