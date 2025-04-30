import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { TechStack, TechCategory } from '../../src/tech-stacks/entities/tech-stack.entity';

export class TechStackSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const techStackRepository = dataSource.getRepository(TechStack);
    
    
    const techStacks = [
      
      { name: 'React', category: TechCategory.FRONTEND },
      { name: 'Angular', category: TechCategory.FRONTEND },
      { name: 'Vue.js', category: TechCategory.FRONTEND },
      { name: 'Next.js', category: TechCategory.FRONTEND },
      { name: 'Svelte', category: TechCategory.FRONTEND },
      { name: 'HTML', category: TechCategory.FRONTEND },
      { name: 'CSS', category: TechCategory.FRONTEND },
      { name: 'JavaScript', category: TechCategory.FRONTEND },
      { name: 'TypeScript', category: TechCategory.FRONTEND },
      
      
      { name: 'Node.js', category: TechCategory.BACKEND },
      { name: 'NestJS', category: TechCategory.BACKEND },
      { name: 'Express', category: TechCategory.BACKEND },
      { name: 'Django', category: TechCategory.BACKEND },
      { name: 'Spring Boot', category: TechCategory.BACKEND },
      { name: 'Laravel', category: TechCategory.BACKEND },
      { name: 'Ruby on Rails', category: TechCategory.BACKEND },
      { name: 'ASP.NET', category: TechCategory.BACKEND },
      { name: 'Java', category: TechCategory.BACKEND },
      { name: 'Python', category: TechCategory.BACKEND },
      
      
      { name: 'MongoDB', category: TechCategory.DATABASE },
      { name: 'PostgreSQL', category: TechCategory.DATABASE },
      { name: 'MySQL', category: TechCategory.DATABASE },
      { name: 'Redis', category: TechCategory.DATABASE },
      { name: 'SQLite', category: TechCategory.DATABASE },
      { name: 'Oracle', category: TechCategory.DATABASE },
      { name: 'Firebase', category: TechCategory.DATABASE },
      
      
      { name: 'Docker', category: TechCategory.DEVOPS },
      { name: 'Kubernetes', category: TechCategory.DEVOPS },
      { name: 'AWS', category: TechCategory.DEVOPS },
      { name: 'Azure', category: TechCategory.DEVOPS },
      { name: 'Jenkins', category: TechCategory.DEVOPS },
      { name: 'GitLab CI', category: TechCategory.DEVOPS },
      { name: 'GitHub Actions', category: TechCategory.DEVOPS },
      
      
      { name: 'React Native', category: TechCategory.MOBILE },
      { name: 'Flutter', category: TechCategory.MOBILE },
      { name: 'Swift', category: TechCategory.MOBILE },
      { name: 'Kotlin', category: TechCategory.MOBILE },
      { name: 'Xamarin', category: TechCategory.MOBILE },
      { name: 'Android', category: TechCategory.MOBILE },
      { name: 'iOS', category: TechCategory.MOBILE },
    ];

    
    for (const techData of techStacks) {
      const existingTech = await techStackRepository.findOneBy({ 
        name: techData.name 
      });

      if (!existingTech) {
        await techStackRepository.insert(techData);
      }
    }
  }
}
