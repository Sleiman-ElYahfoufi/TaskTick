import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../src/users/entities/user.entity';
import { Project } from '../src/projects/entities/project.entity';
import { Task } from '../src/tasks/entities/task.entity';
import { TimeTracking } from '../src/time-trackings/entities/time-tracking.entity';
import { TechStack } from '../src/tech-stacks/entities/tech-stack.entity';
import { UserTechStack } from '../src/user-tech-stacks/entities/user-tech-stack.entity';
import { AiInsight } from '../src/ai-insights/entities/ai-insight.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'tasktick',
  entities: [
    User,
    Project,
    Task,
    TimeTracking,
    TechStack,
    UserTechStack,
    AiInsight
  ],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;