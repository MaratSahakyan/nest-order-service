export class SignInDto {
  id: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  accessToken: string;
}
