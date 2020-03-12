/* eslint-disable import/extensions */
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MessageModule } from './modules/message/message.module'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY } from './common/constants'
@Module({
  imports: [ConfigModule.forRoot(), MessageModule, GraphQLModule.forRoot({
    typePaths: ['./**/*.graphql'],
    context: ({ req, connection }) => {
      if (connection) {
        return {
          req: connection.context
        }
      }
      return ({ req })
    },
    installSubscriptionHandlers: true,
    subscriptions: {
      onConnect: (connectionParams, ws) => {
        try {
          const { Authorization } = Object.assign(connectionParams)
          if (!Authorization) return false
          const token = Authorization.split(' ')[1]
          const data = jwt.verify(token, SECRET_KEY)
          return data
        } catch (err) {
          return false
        }
      }
    },
    definitions: {
      path: join(process.cwd(), 'src/graphql.ts'),
    },
  })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
