import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({ 
              access_token: 'test-token',
              user: { id: 1, username: 'testuser' } 
            }),
            generateToken: jest.fn().mockResolvedValue('test-token'),
            register: jest.fn().mockResolvedValue({
              user: { id: 1, username: 'testuser' },
              access_token: 'test-token'
            })
          }
        },
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('test-token'),
            verifyAsync: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a JWT token and user info when credentials are valid', async () => {
      const signInDto: SignInDto = {
        username: 'testuser',
        password: 'password'
      };

      const result = await controller.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(
        signInDto.username, 
        signInDto.password
      );
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });
  });
});