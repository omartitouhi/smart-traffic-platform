import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLProxyController } from './graphql-proxy.controller';

@Module({
  imports: [],
  controllers: [AppController, GraphQLProxyController],
  providers: [AppService],
})
export class AppModule {}
