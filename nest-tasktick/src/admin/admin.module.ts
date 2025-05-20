import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';
import { TimeTrackingsModule } from '../time-trackings/time-trackings.module';

@Module({
    imports: [
        UsersModule, 
        AuthModule, 
        ProjectsModule, 
        TasksModule, 
        TimeTrackingsModule
    ],
    controllers: [AdminController]
})
export class AdminModule { } 