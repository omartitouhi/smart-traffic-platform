import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from './notification.gateway';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [NotificationGateway, NotificationResolver, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
