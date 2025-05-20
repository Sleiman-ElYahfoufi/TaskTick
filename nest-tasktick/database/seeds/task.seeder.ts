import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Task, TaskStatus, PriorityLevel } from '../../src/tasks/entities/task.entity';
import { Project } from '../../src/projects/entities/project.entity';

export class TaskSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const taskRepository = dataSource.getRepository(Task);
    const projectRepository = dataSource.getRepository(Project);
    
    
    const projects = await projectRepository.find();
    
    
    const projectTasks = {
      'E-commerce Platform': [
        {
          name: 'Setup project structure',
          description: 'Initialize the project and setup the basic structure',
          estimated_time: 4,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.COMPLETED,
          progress: 100,
        },
        {
          name: 'Design database schema',
          description: 'Create ERD and design the database schema',
          estimated_time: 8,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.COMPLETED,
          progress: 100,
        },
        {
          name: 'Implement user authentication',
          description: 'Implement registration, login, and password reset',
          estimated_time: 12,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.IN_PROGRESS,
          progress: 60,
        },
        {
          name: 'Product catalog implementation',
          description: 'Create product listing with filtering and searching',
          estimated_time: 20,
          priority: PriorityLevel.MEDIUM,
          status: TaskStatus.IN_PROGRESS,
          progress: 30,
        },
        {
          name: 'Shopping cart functionality',
          description: 'Implement shopping cart and order processing',
          estimated_time: 16,
          priority: PriorityLevel.MEDIUM,
          status: TaskStatus.TODO,
          progress: 0,
        },
      ],
      'Content Management System': [
        {
          name: 'Research CMS requirements',
          description: 'Research features needed for the CMS',
          estimated_time: 6,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.COMPLETED,
          progress: 100,
        },
        {
          name: 'Design admin interface',
          description: 'Create wireframes for the admin dashboard',
          estimated_time: 10,
          priority: PriorityLevel.MEDIUM,
          status: TaskStatus.IN_PROGRESS,
          progress: 50,
        },
        {
          name: 'Content model design',
          description: 'Design the content models and relationships',
          estimated_time: 8,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.IN_PROGRESS,
          progress: 40,
        },
      ],
      'Mobile Fitness App': [
        {
          name: 'UI/UX design',
          description: 'Design user interface and experience for the app',
          estimated_time: 15,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.IN_PROGRESS,
          progress: 70,
        },
        {
          name: 'Fitness tracking features',
          description: 'Implement core fitness tracking functionality',
          estimated_time: 25,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.TODO,
          progress: 0,
        },
      ],
      'Banking API Integration': [
        {
          name: 'API research',
          description: 'Research available banking APIs and their documentation',
          estimated_time: 10,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.COMPLETED,
          progress: 100,
        },
        {
          name: 'Authentication implementation',
          description: 'Implement OAuth authentication for banking APIs',
          estimated_time: 15,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.IN_PROGRESS,
          progress: 80,
        },
        {
          name: 'Transaction handling',
          description: 'Implement transaction processing and reconciliation',
          estimated_time: 20,
          priority: PriorityLevel.MEDIUM,
          status: TaskStatus.TODO,
          progress: 0,
        },
      ],
      'Portfolio Website': [
        {
          name: 'Design homepage',
          description: 'Design the homepage layout',
          estimated_time: 5,
          priority: PriorityLevel.MEDIUM,
          status: TaskStatus.COMPLETED,
          progress: 100,
        },
        {
          name: 'Project showcase section',
          description: 'Create the project showcase with filtering',
          estimated_time: 8,
          priority: PriorityLevel.HIGH,
          status: TaskStatus.IN_PROGRESS,
          progress: 60,
        },
        {
          name: 'Contact form',
          description: 'Implement contact form with validation and email sending',
          estimated_time: 4,
          priority: PriorityLevel.LOW,
          status: TaskStatus.TODO,
          progress: 0,
        },
      ],
    };
    
    
    for (const project of projects) {
      const tasks = projectTasks[project.name];
      
      if (tasks) {
        for (const taskData of tasks) {
          const existingTask = await taskRepository.findOneBy({ 
            name: taskData.name,
            project_id: project.id
          });
          
          if (!existingTask) {
            
            let dueDate;
            if (taskData.status !== TaskStatus.COMPLETED) {
              
              const daysToAdd = taskData.priority === PriorityLevel.HIGH ? 7 : 14;
              dueDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
            }
            
            await taskRepository.insert({
              ...taskData,
              dueDate,
              project_id: project.id,
            });
          }
        }
      }
    }
  }
}
