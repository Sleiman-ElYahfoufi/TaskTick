
import { runSeeder } from 'typeorm-extension';
import dataSource from '../data-source';
import { MainSeeder } from './main-seeder';

const runSeed = async () => {
  try {
    
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('Database connection initialized');
    }
    
    
    await runSeeder(dataSource, MainSeeder);
    console.log('Seeders executed successfully');
    
    
    await dataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeed()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  });