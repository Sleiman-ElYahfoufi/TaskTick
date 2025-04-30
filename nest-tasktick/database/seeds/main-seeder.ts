
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserSeeder } from './user.seeder';
import { TechStackSeeder } from './tech-stack.seeder';
import { UserTechStackSeeder } from './user-tech-stack.seeder';
import { ProjectSeeder } from './project.seeder';
import { TaskSeeder } from './task.seeder';
import { TimeTrackingSeeder } from './time-tracking.seeder';
import { AiInsightSeeder } from './ai-insight.seeder';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    
    console.log('Running UserSeeder...');
    await new UserSeeder().run(dataSource, factoryManager);
    
    console.log('Running TechStackSeeder...');
    await new TechStackSeeder().run(dataSource, factoryManager);
    
    console.log('Running UserTechStackSeeder...');
    await new UserTechStackSeeder().run(dataSource, factoryManager);
    
    console.log('Running ProjectSeeder...');
    await new ProjectSeeder().run(dataSource, factoryManager);
    
    console.log('Running TaskSeeder...');
    await new TaskSeeder().run(dataSource, factoryManager);
    
    console.log('Running TimeTrackingSeeder...');
    await new TimeTrackingSeeder().run(dataSource, factoryManager);
    
    console.log('Running AiInsightSeeder...');
    await new AiInsightSeeder().run(dataSource, factoryManager);
    
    console.log('All seeders completed successfully!');
  }
}