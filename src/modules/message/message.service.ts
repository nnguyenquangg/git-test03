/* eslint-disable import/extensions */
import { Injectable } from '@nestjs/common'
import { MessageInput } from 'src/graphql'
import { Messages } from '../../common/data'
import * as uuid from 'uuid'

@Injectable()
export class MessageService {
  async create(input: MessageInput, userID: string) {
    console.log(userID)
    const { content, roomID } = input
    const messeage = {
      _id: await uuid.v4(),
      createdBy: userID,
      roomID,
      content,
      createdAt: new Date().getTime()
    }
    Messages.push(messeage)
    console.log(messeage)
    return messeage
  }
}
