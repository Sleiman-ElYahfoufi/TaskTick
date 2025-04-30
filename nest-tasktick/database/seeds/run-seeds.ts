import dataSource from '../data-source';
import { TechStack } from '../../src/tech-stacks/entities/tech-stack.entity';

async function runSeeds() {
  try {
    // Initialize the data source
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    
    console.log('Connected to database. Starting seed process...');
    
    const techStackRepository = dataSource.getRepository(TechStack);
    
    const existingCount = await techStackRepository.count();
    if (existingCount > 0) {
      console.log(`Skipping tech stack seed, ${existingCount} records already exist.`);
    } else {
      // Add your seed data here
      // For example:
      /*
      await techStackRepository.save([
        { name: 'JavaScript', category: 'frontend' },
        { name: 'TypeScript', category: 'frontend' },
        { name: 'React', category: 'frontend' },
        { name: 'Node.js', category: 'backend' },
        // Add more as needed
      ]);
      console.log('Tech stack seed completed successfully.');
      */
    }
    
    console.log('All seeds completed successfully.');
  } catch (error) {
    console.error('Error during seed process:', error);
  } finally {
    // Close the connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeeds();