import { WSController, OnWSMessage, Inject, OnWSDisConnection } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { MinerService } from '../service/miner.service';

@WSController()
export class HelloSocketController {
  @Inject()
  ctx: Context;

  @Inject()
  minerService: MinerService;

  @OnWSMessage('message')
  async gotMessage(data) {
    console.log('data', data);
    return { success: 1 };
  }

  @OnWSDisConnection()
  async disconnect(id: number) {
    console.log('disconnect ' + id);
  }
}
