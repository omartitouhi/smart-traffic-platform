import { JwtStrategy } from './jwt.strategy';
import { Role } from '../../enums/role.enum';

describe('JwtStrategy', () => {
  const previousSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-access-secret';
  });

  afterEach(() => {
    process.env.JWT_SECRET = previousSecret;
  });

  it('maps a JWT payload to an authenticated user', () => {
    const strategy = new JwtStrategy();

    expect(
      strategy.validate({
        sub: 'user-id',
        email: 'operator@example.com',
        role: Role.OPERATOR,
      }),
    ).toEqual({
      id: 'user-id',
      email: 'operator@example.com',
      role: Role.OPERATOR,
    });
  });
});
