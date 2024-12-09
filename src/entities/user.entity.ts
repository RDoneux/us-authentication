import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ name: 'username', type: 'varchar' })
  username!: string;

  @Column({ name: 'password', type: 'varchar' })
  password!: string;
}
