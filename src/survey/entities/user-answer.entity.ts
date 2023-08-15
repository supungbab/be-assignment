import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_survey_id: number;

  @Column()
  question_id: number;

  @Column()
  choice_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
