
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { TimeTracking } from '../../src/time-trackings/entities/time-tracking.entity';
import { User } from '../../src/users/entities/user.entity';
import { Task } from '../../src/tasks/entities/task.entity';

export class TimeTrackingSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const timeTrackingRepository = dataSource.getRepository(TimeTracking);
    const userRepository = dataSource.getRepository(User);
    const taskRepository = dataSource.getRepository(Task);
    
    
    const users = await userRepository.find();
    const tasks = await taskRepository.find({
      relations: ['project'],
    });
    
    
    const now = new Date();
    
    
    for (const task of tasks) {
      
      const user = users.find(u => u.id === task.project.user_id);
      
      if (!user) continue;
      
      
      const entriesCount = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < entriesCount; i++) {
        
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        
        
        const durationHours = Math.random() * 3.5 + 0.5;
        const durationMs = durationHours * 60 * 60 * 1000;
        
        
        const startHour = 9 + Math.floor(Math.random() * 8);
        date.setHours(startHour, Math.floor(Math.random() * 60), 0, 0);
        
        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + durationMs);
        
        
        const isCompleted = Math.random() > 0.2; 
        
        
        const timeTracking = new TimeTracking();
        timeTracking.user_id = user.id;
        timeTracking.task_id = task.id;
        timeTracking.start_time = startTime;
        
        if (isCompleted) {
          timeTracking.end_time = endTime;
          timeTracking.session_duration = durationHours;
        }
        timeTracking.date = new Date(date.setHours(0, 0, 0, 0));
        
        
        const existingEntry = await timeTrackingRepository.findOneBy({
          user_id: timeTracking.user_id,
          task_id: timeTracking.task_id,
          start_time: timeTracking.start_time,
        });
        
        
        if (!existingEntry) {
          await timeTrackingRepository.save(timeTracking);
        }
      }
    }
  }
}