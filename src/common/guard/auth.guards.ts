/* eslint-disable import/extensions */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../constants'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const ctx = GqlExecutionContext.create(context)
      const { authorization } = ctx.getContext().req.headers
      if (!authorization) return false
      const token = authorization.split(' ')[1]
      const data = jwt.verify(token, SECRET_KEY)
      ctx.getContext().data = data
    } catch (err) {
      return false
    }
    return true
  }
}
