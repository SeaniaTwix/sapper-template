import sirv from 'sirv'
import helmet from 'helmet'
import compression from 'compression'
import {ignore, session} from './config'
import * as sapper from '@sapper/server'
import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {ValidationPipe} from '@nestjs/common'

const {PORT, NODE_ENV} = process.env
const dev = NODE_ENV === 'development'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const comp = compression({threshold: 0})
  const statics = sirv('static', {dev})
  const plugins = [
    comp,
    statics,
    sapper.middleware({
      ignore,
      session,
    }),
    require('express-rate-limit')({
      windowMs: 900000,
      max: 77,
    }),
  ]

  if (!dev) {
    plugins.push(helmet())
  }

  app.use(...plugins)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT)
}

bootstrap().then()
