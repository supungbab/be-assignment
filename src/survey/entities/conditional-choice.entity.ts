import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ConditionalChoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  survey_id: number;

  @Column()
  target_question: number;

  @Column()
  specific_choice: number;

  @Column()
  next_question: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
