export type UserRole = "ADMIN" | "OPERATOR";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  firstName: string;
  lastName: string;
};
