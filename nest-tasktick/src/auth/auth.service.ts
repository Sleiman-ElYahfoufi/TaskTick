import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    
    const token = await this.generateToken(user.id, user.username);
    
    return {
      user,
      access_token: token
    };
  }

  async signIn(username: string, pass: string): Promise<{ access_token: string, user: any }> {
    const user = await this.usersService.findByUsername(username);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const token = await this.generateToken(user.id, user.username);
    
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      access_token: token
    };
  }
  

  async generateToken(userId: number, username: string): Promise<string> {
    const payload = { sub: userId, username };
    return this.jwtService.signAsync(payload);
  }
}