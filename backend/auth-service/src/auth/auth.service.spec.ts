import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

type PrismaMock = {
  user: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
  };
};

type JwtMock = {
  sign: jest.Mock;
  decode: jest.Mock;
  verify: jest.Mock;
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaMock;
  let jwtService: JwtMock;

  const createdAt = new Date('2026-06-02T08:00:00.000Z');
  const updatedAt = new Date('2026-06-02T08:05:00.000Z');
  const user = {
    id: '945b48f4-02e4-43c2-9d3b-8e80fa8c9a17',
    email: 'operator@example.com',
    password: 'hashed-password',
    firstName: 'Traffic',
    lastName: 'Operator',
    role: 'OPERATOR',
    refreshTokenHash: null,
    refreshTokenExpiresAt: null,
    createdAt,
    updatedAt,
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn(),
      decode: jest.fn(),
      verify: jest.fn(),
    };

    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');
    jwtService.decode.mockReturnValue({ exp: 1_800_000_000 });
    prisma.user.update.mockResolvedValue(user);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user and generate JWT tokens', async () => {
    prisma.user.create.mockResolvedValue(user);

    const result = await service.register({
      email: ' Operator@Example.COM ',
      password: 'Password123!',
      firstName: 'Traffic',
      lastName: 'Operator',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'operator@example.com',
        password: 'hashed-password',
        firstName: 'Traffic',
        lastName: 'Operator',
      },
    });
    expect(jwtService.sign).toHaveBeenCalledTimes(2);
    expect(jwtService.sign).toHaveBeenNthCalledWith(
      1,
      { sub: user.id, email: user.email, role: user.role },
      { secret: 'test-access-secret', expiresIn: '15m' },
    );
    expect(jwtService.sign).toHaveBeenNthCalledWith(
      2,
      { sub: user.id },
      { secret: 'test-refresh-secret', expiresIn: '7d' },
    );
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        refreshTokenHash: 'hashed-password',
        refreshTokenExpiresAt: new Date(1_800_000_000 * 1000),
      },
    });
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt,
        updatedAt,
      },
    });
  });

  it('should throw ConflictException when registering an existing email', async () => {
    prisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.register({
        email: 'operator@example.com',
        password: 'Password123!',
        firstName: 'Traffic',
        lastName: 'Operator',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should login with valid credentials and generate JWT tokens', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await service.login({
      email: ' Operator@Example.COM ',
      password: 'Password123!',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'operator@example.com' },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', user.password);
    expect(jwtService.sign).toHaveBeenCalledTimes(2);
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user.email).toBe(user.email);
  });

  it('should reject login with an unknown email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'Password123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should reject login with a bad password', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({
        email: user.email,
        password: 'WrongPassword123!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should validate invalid register email input', async () => {
    const input = new RegisterInput();
    input.email = 'not-an-email';
    input.password = 'Password123!';
    input.firstName = 'Traffic';
    input.lastName = 'Operator';

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'email')).toBe(true);
  });

  it('should validate invalid login email input', async () => {
    const input = new LoginInput();
    input.email = 'not-an-email';
    input.password = 'Password123!';

    const errors = await validate(input);

    expect(errors.some((error) => error.property === 'email')).toBe(true);
  });
});
