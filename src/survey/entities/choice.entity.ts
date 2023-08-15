import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question_id: number;

  @Column('text')
  content: string;

  @Column()
  order: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
