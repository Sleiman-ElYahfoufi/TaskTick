import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [UsersModule, AuthModule],
    controllers: [AdminController]
})
export class AdminModule { } 