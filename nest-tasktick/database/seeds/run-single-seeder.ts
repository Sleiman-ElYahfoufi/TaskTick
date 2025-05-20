import { runSeeder } from 'typeorm-extension';
import dataSource from '../data-source';
import { UserSeeder } from './user.seeder';
import { TechStackSeeder } from './tech-stack.seeder';
import { UserTechStackSeeder } from './user-tech-stack.seeder';
import { ProjectSeeder } from './project.seeder';
import { TaskSeeder } from './task.seeder';
import { TimeTrackingSeeder } from './time-tracking.seeder';
import { AiInsightSeeder } from './ai-insight.seeder';

const seeders = {
    'user': UserSeeder,
    'tech-stack': TechStackSeeder,
    'user-tech-stack': UserTechStackSeeder,
    'project': ProjectSeeder,
    'task': TaskSeeder,
    'time-tracking': TimeTrackingSeeder,
    'ai-insight': AiInsightSeeder
};

const runSingleSeed = async () => {
    // Get the seeder name from command line argument
    const seederName = process.argv[2];

    if (!seederName || !seeders[seederName]) {
        console.error(`Please provide a valid seeder name. Available seeders: ${Object.keys(seeders).join(', ')}`);
        process.exit(1);
    }

    const SeederClass = seeders[seederName];

    try {
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
            console.log('Database connection initialized');
        }

        console.log(`Running ${seederName} seeder...`);
        await runSeeder(dataSource, SeederClass);
        console.log(`${seederName} seeder executed successfully`);

        await dataSource.destroy();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

runSingleSeed()
    .then(() => {
        console.log('Seeding completed successfully');
        process.exit(0);
    }); 