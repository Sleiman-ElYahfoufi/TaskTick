import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Project, ProjectStatus, PriorityLevel, DetailDepth } from '../../src/projects/entities/project.entity';
import { User } from '../../src/users/entities/user.entity';

export class ProjectSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const projectRepository = dataSource.getRepository(Project);
    const userRepository = dataSource.getRepository(User);
    
    
    const users = await userRepository.find();
    
    
    const projects = [
      {
        name: 'E-commerce Platform',
        description: 'A full-featured e-commerce platform with product management, cart, and checkout',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
        priority: PriorityLevel.HIGH,
        detail_depth: DetailDepth.DETAILED,
        status: ProjectStatus.IN_PROGRESS,
        estimated_time: 120, 
        accuracy_rating: 85, 
        username: 'johndoe',
      },
      {
        name: 'Content Management System',
        description: 'A CMS for managing blog posts, pages, and media content',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), 
        priority: PriorityLevel.MEDIUM,
        detail_depth: DetailDepth.NORMAL,
        status: ProjectStatus.PLANNING,
        estimated_time: 80, 
        accuracy_rating: 75, 
        username: 'janedoe',
      },
      {
        name: 'Mobile Fitness App',
        description: 'A fitness tracking application for mobile devices',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 
        priority: PriorityLevel.MEDIUM,
        detail_depth: DetailDepth.NORMAL,
        status: ProjectStatus.PLANNING,
        estimated_time: 100, 
        accuracy_rating: 70, 
        username: 'alicejones',
      },
      {
        name: 'Banking API Integration',
        description: 'Integration with multiple banking APIs for financial transactions',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), 
        priority: PriorityLevel.HIGH,
        detail_depth: DetailDepth.DETAILED,
        status: ProjectStatus.IN_PROGRESS,
        estimated_time: 60, 
        accuracy_rating: 90, 
        username: 'mikeross',
      },
      {
        name: 'Portfolio Website',
        description: 'Personal portfolio website with project showcase',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
        priority: PriorityLevel.LOW,
        detail_depth: DetailDepth.MINIMAL,
        status: ProjectStatus.IN_PROGRESS,
        estimated_time: 25, 
        accuracy_rating: 95, 
        username: 'bobsmith',
      }
    ];
    
    
    for (const projectData of projects) {
      const { username, ...project } = projectData;
      const user = users.find(u => u.username === username);
      
      if (user) {
        const existingProject = await projectRepository.findOneBy({ 
          name: project.name,
          user_id: user.id 
        });
        
        if (!existingProject) {
          await projectRepository.insert({
            ...project,
            user_id: user.id,
          });
        }
      }
    }
  }
}
