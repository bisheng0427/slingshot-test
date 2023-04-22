import { WSController, OnWSMessage, Inject, OnWSDisConnection, WSEmit } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { MinerHistoryService } from '../service/minerHistory.service';
import { IMessage, IRes } from '../types/common.types'
import { WS_ACTION, WS_TYPE } from '../types/common.enums'

@WSController()
export class MinerSocketController {
    @Inject()
    ctx: Context;

    @Inject()
    minerHistory: MinerHistoryService

    @OnWSMessage(WS_TYPE.MINER_HISTORY)
    @WSEmit('data')
    async gotMessage(data) {
        let res: IRes = { type: WS_TYPE.MINER_HISTORY, success: true }
        try {
            const message: IMessage = data

            res = { ...res, ...message }
            switch (message.action) {
                case WS_ACTION.GET_LIST:
                    res.data = await this.minerHistory.getList(message.payload)
                    console.log('got list', res.data)
                    break;
                default:
                    break;
            }
        } catch (error) {
            res.success = false
            res.message = 'minerHistory message process failed'
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
