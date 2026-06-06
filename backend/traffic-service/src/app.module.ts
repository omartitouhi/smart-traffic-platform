import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './common/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrafficModule } from './traffic/traffic.module';

const isProd = process.env.NODE_ENV === 'production';
const isGraphqlUiEnabled =
  process.env.GRAPHQL_UI_ENABLED === 'true' ||
  (process.env.GRAPHQL_UI_ENABLED !== 'false' && !isProd);

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: isGraphqlUiEnabled,
      playground: false,
      plugins: isGraphqlUiEnabled
        ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
        : [],
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    AuthModule,
    PrismaModule,
    TrafficModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
