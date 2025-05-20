import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../auth/admin.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(private readonly usersService: UsersService) { }

    @Get('users')
    findAllUsers() {
        return this.usersService.findAll();
    }

    @Post('users/admin')
    createAdminUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createAdmin(createUserDto);
    }

    @Post('users/:id/make-admin')
    makeUserAdmin(@Param('id') id: string) {
        return this.usersService.setAdminRole(+id);
    }
} 