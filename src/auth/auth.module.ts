import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

console.log('process.env.ACCESS_SECRET', process.env.JWT_ACCESS_SECRET);
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15' },
    }),
  ],
})
export class AuthModule {}
