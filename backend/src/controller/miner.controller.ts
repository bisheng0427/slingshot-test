import { WSController, OnWSMessage, Inject, OnWSDisConnection, WSEmit } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { MinerService } from '../service/miner.service';
import { IMessage, IRes } from '../types/common.types'
import { WS_ACTION, WS_TYPE } from '../types/common.enums'
import { MinerHistoryService } from '../service/minerHistory.service';

@WSController()
export class MinerSocketController {
  @Inject()
  ctx: Context;

  @Inject()
  minerService: MinerService;

  @Inject()
  minerHistory: MinerHistoryService

  @OnWSMessage(WS_TYPE.MINER)
  @WSEmit('data')
  async gotMessage(data) {
    let res: IRes = { type: WS_TYPE.MINER, success: true }
    try {
      const message: IMessage = data
      console.log('miner message', message)

      res = { ...res, ...message }
      switch (message.action) {
        case WS_ACTION.GET_LIST:
          res.data = await this.minerService.getList({})
          break;
        case WS_ACTION.GET_INFO:
          res.data = await this.minerService.findOne(message.payload)
          break;
        default:
          break;
      }
    } catch (error) {
      res.success = false
      res.message = 'mienr message process failed'
    }
    return res

  }

  @OnWSDisConnection()
  async disconnect(id: number) {
    console.log('disconnect ' + id);
  }

  async mine() {

  }
}
