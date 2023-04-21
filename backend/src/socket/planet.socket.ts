import { WSController, OnWSMessage, Inject, OnWSDisConnection } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { PlanetService } from '../service/planet.entity';
import { IMessage, IRes } from '../types/common.types'
import { WS_ACTION } from '../types/common.enums'

@WSController()
export class PlanetSocketController {
    @Inject()
    ctx: Context;

    @Inject()
    planetService: PlanetService;

    @OnWSMessage('message')
    async gotMessage(data: Buffer) {
        let res: IRes = { success: true }
        try {
            const message: IMessage = JSON.parse(Buffer.from(data).toString('utf-8'))
            if (message.type !== 'planet') return
            res = { ...res, ...message }
            console.log('planet message', message)

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
                    if (!miner) {
                        res.success = false
                        res.message = 'mineral is not enough'
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
