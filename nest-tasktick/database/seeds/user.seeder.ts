import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User, UserRole, ExperienceLevel } from '../../src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    
    
    const users = [
      {
        username: 'johndoe',
        password: await bcrypt.hash('password123', 10),
        email: 'john.doe@example.com',
        role: UserRole.FULLSTACK_DEVELOPER,
        experience_level: ExperienceLevel.EXPERT,
      },
      {
        username: 'janedoe',
        password: await bcrypt.hash('password123', 10),
        email: 'jane.doe@example.com',
        role: UserRole.BACKEND_DEVELOPER,
        experience_level: ExperienceLevel.INTERMEDIATE,
      },
      {
        username: 'bobsmith',
        password: await bcrypt.hash('password123', 10),
        email: 'bob.smith@example.com',
        role: UserRole.WEB_DEVELOPER,
        experience_level: ExperienceLevel.BEGINNER,
      },
      {
        username: 'alicejones',
        password: await bcrypt.hash('password123', 10),
        email: 'alice.jones@example.com',
        role: UserRole.MOBILE_DEVELOPER,
        experience_level: ExperienceLevel.INTERMEDIATE,
      },
      {
        username: 'mikeross',
        password: await bcrypt.hash('password123', 10),
        email: 'mike.ross@example.com',
        role: UserRole.SOFTWARE_ENGINEER,
        experience_level: ExperienceLevel.EXPERT,
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOneBy({ 
        username: userData.username 
      });

      if (!existingUser) {
        await userRepository.insert(userData);
      }
    }
  }
}
