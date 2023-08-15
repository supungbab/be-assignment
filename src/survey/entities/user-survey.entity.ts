import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserSurvey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  survey_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
