import { WSController, OnWSMessage, Inject, OnWSDisConnection, WSEmit } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { PlanetService } from '../service/planet.service';
import { IMessage, IRes } from '../types/common.types'
import { WS_ACTION, WS_TYPE } from '../types/common.enums'
import { EventService } from '../service/event.service';

@WSController()
export class PlanetSocketController {
    @Inject()
    ctx: Context;

    @Inject()
    planetService: PlanetService;

    @Inject()
    eventSrv: EventService


    @OnWSMessage('planet')
    @WSEmit('data')
    async gotMessage(message: IMessage) {
        let res: IRes = { type: WS_TYPE.PLANET, success: true }

        this.eventSrv.eventEmitter.on('newSimData', (data) => {
            this.ctx.emit('data', {
                type: WS_TYPE.PLANET,
                action: WS_ACTION.NEW_SIM_DATA,
                data: data
            })
        })

        try {
            res = { ...res, ...message }

            // process different socket actions
            switch (message.action) {
                case WS_ACTION.GET_LIST:
                    res.data = await this.planetService.getList()
                    break;
                case WS_ACTION.UPDATE:
                    res.data = await this.planetService.update(message.payload.id, message.payload)
                    break;
                case WS_ACTION.SPAWN_MINER:
                    const miner = await this.planetService.spawnMiner(message.payload.planetId, message.payload)
                    if (miner.failed) {
                        res.success = false
                        res.message = miner.message
                    } else {
                        res.data = miner
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            res.success = false
            res.message = 'planet message process failed'
        }
        return res
    }

    @OnWSDisConnection()
    async disconnect(id: number) {
        console.log('disconnect ' + id);
    }
}
