import {
  Resolver, Mutation, Args, Context, Subscription
} from '@nestjs/graphql'
import { MessageService } from './message.service'
import { PubSub } from 'graphql-subscriptions'
import { MessageInput, Message } from 'src/graphql'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/guard/auth.guards'

const pubsub = new PubSub()

@Resolver('Message')
export class MessageResolver {
  constructor(private readonly messService : MessageService) {}

  @UseGuards(AuthGuard)
  @Mutation()
  async createMessage(@Args('message') message : MessageInput,
    @Context() context) : Promise<Message> {
    const { userID } = context.data
    const result = await this.messService.create(message, userID)
    pubsub.publish('messageCreated', {
      messageCreated: result
    })
    return result
  }

  @Subscription('messageCreated', {
    filter: (payload, variables, context) => payload.messageCreated.roomID === variables.roomID
      && context.req.privileges.some((roomid: any) => roomid === variables.roomID)
  })
  async messageCreated() {
    return pubsub.asyncIterator('messageCreated')
  }
}
