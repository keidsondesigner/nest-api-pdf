import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pdf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  uploadDate: Date;
}
