import { WSController, OnWSMessage, Inject, OnWSDisConnection } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { MinerService } from '../service/miner.service';
import { IMessage, IRes } from '../types/common.types'
import { WS_ACTION } from '../types/common.enums'


@WSController()
export class MinerSocketController {
    @Inject()
    ctx: Context;

    @Inject()
    minerService: MinerService;

    @OnWSMessage('message')
    async gotMessage(data: Buffer) {
        let res: IRes = { success: true }
        try {
            const message: IMessage = JSON.parse(Buffer.from(data).toString('utf-8'))
            if (message.type !== 'miner') return
            res = { ...res, ...message }
            console.log('mienr message', message)


            switch (message.action) {
                case WS_ACTION.GET_LIST:
                    res.data = await this.minerService.getList()
                    break;
                default:
                    break;
            }
        } catch (error) {
            res.success = false
            res.message = 'asteroid message process failed'
        }
        return res
    }

    @OnWSDisConnection()
    async disconnect(id: number) {
        console.log('disconnect ' + id);
    }
}
