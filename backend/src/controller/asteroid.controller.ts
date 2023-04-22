import { WSController, OnWSMessage, Inject, OnWSDisConnection, WSEmit } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { AsteroidService } from '../service/asteroid.service';
import { IMessage, IRes } from '../types/common.types'
import { WS_ACTION, WS_TYPE } from '../types/common.enums'


@WSController()
export class MinerSocketController {
    @Inject()
    ctx: Context;

    @Inject()
    asteroidService: AsteroidService;

    @OnWSMessage(WS_TYPE.ASTEROID)
    @WSEmit('data')
    async gotMessage(message: IMessage) {
        let res: IRes = { type: WS_TYPE.ASTEROID, success: true }
        try {
            console.log('asteroid')
            res = { ...res, ...message }

            switch (message.action) {
                case WS_ACTION.GET_LIST:
                    res.data = await this.asteroidService.getList()
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
