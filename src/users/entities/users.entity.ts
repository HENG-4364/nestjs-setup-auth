import { Field } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field()
  email: string;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ nullable: true })
  @Field()
  password: string;
}
