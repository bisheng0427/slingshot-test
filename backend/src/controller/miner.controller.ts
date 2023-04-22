import { WSController, OnWSMessage, Inject, OnWSDisConnection, WSEmit } from '@midwayjs/core';
import { MinerService } from '../service/miner.service';
import { IMessage, IRes } from '../types/common.types'
import { WS_ACTION, WS_TYPE } from '../types/common.enums'
import { MinerHistoryService } from '../service/minerHistory.service';
import { EventService } from '../service/event.service';
import { Context } from '@midwayjs/socketio';

@WSController()
export class MinerSocketController {
  @Inject()
  ctx: Context;

  @Inject()
  minerService: MinerService;

  @Inject()
  minerHistory: MinerHistoryService

  @Inject()
  eventSrv: EventService

  @OnWSMessage(WS_TYPE.MINER)
  @WSEmit('data')
  async gotMessage(data) {
    let res: IRes = { type: WS_TYPE.MINER, success: true }

    this.eventSrv.eventEmitter.on('newSimData', (data) => {
      this.ctx.emit('data', {
        type: WS_TYPE.MINER,
        action: WS_ACTION.NEW_SIM_DATA,
        data: data
      })
    })

    try {
      const message: IMessage = data

      res = { ...res, ...message }
      switch (message.action) {
        case WS_ACTION.GET_LIST:
          res.data = await this.minerService.getList(message.payload || {})
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
