import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserTechStack } from '../../src/user-tech-stacks/entities/user-tech-stack.entity';
import { User } from '../../src/users/entities/user.entity';
import { TechStack } from '../../src/tech-stacks/entities/tech-stack.entity';

export class UserTechStackSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userTechStackRepository = dataSource.getRepository(UserTechStack);
    const userRepository = dataSource.getRepository(User);
    const techStackRepository = dataSource.getRepository(TechStack);
    
    
    const users = await userRepository.find();
    const techStacks = await techStackRepository.find();
    
    
    const userTechAssignments = [
      
      { username: 'johndoe', techName: 'React', proficiency: 5 },
      { username: 'johndoe', techName: 'Node.js', proficiency: 5 },
      { username: 'johndoe', techName: 'MongoDB', proficiency: 4 },
      { username: 'johndoe', techName: 'Docker', proficiency: 3 },
      { username: 'johndoe', techName: 'TypeScript', proficiency: 5 },
      
      
      { username: 'janedoe', techName: 'NestJS', proficiency: 4 },
      { username: 'janedoe', techName: 'PostgreSQL', proficiency: 3 },
      { username: 'janedoe', techName: 'Redis', proficiency: 3 },
      { username: 'janedoe', techName: 'Express', proficiency: 4 },
      
      
      { username: 'bobsmith', techName: 'HTML', proficiency: 2 },
      { username: 'bobsmith', techName: 'CSS', proficiency: 2 },
      { username: 'bobsmith', techName: 'JavaScript', proficiency: 1 },
      
      
      { username: 'alicejones', techName: 'React Native', proficiency: 4 },
      { username: 'alicejones', techName: 'Swift', proficiency: 3 },
      { username: 'alicejones', techName: 'Firebase', proficiency: 3 },
      
      
      { username: 'mikeross', techName: 'Java', proficiency: 5 },
      { username: 'mikeross', techName: 'Spring Boot', proficiency: 5 },
      { username: 'mikeross', techName: 'MySQL', proficiency: 4 },
      { username: 'mikeross', techName: 'AWS', proficiency: 4 },
    ];
    
    
    for (const assignment of userTechAssignments) {
      const user = users.find(u => u.username === assignment.username);
      const tech = techStacks.find(t => t.name === assignment.techName);
      
      if (user && tech) {
        const existingRelation = await userTechStackRepository.findOneBy({
          user_id: user.id,
          tech_id: tech.id,
        });
        
        if (!existingRelation) {
          await userTechStackRepository.insert({
            user_id: user.id,
            tech_id: tech.id,
            proficiency_level: assignment.proficiency,
          });
        }
      }
    }
  }
}
