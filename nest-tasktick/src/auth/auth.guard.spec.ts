import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtServiceMock = {} as JwtService;
    const reflectorMock = {} as Reflector;
    
    expect(new AuthGuard(jwtServiceMock, reflectorMock)).toBeDefined();
  });
});