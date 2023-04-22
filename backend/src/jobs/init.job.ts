import { Inject, Provide, Scope, ScopeEnum } from "@midwayjs/core";

import { MinerService } from "../service/miner.service";
import { ASTEROID_STATUS, MINER_STATUS } from "../types/common.enums";
import { PlanetService } from "../service/planet.service";
import { AsteroidService } from "../service/asteroid.service";
import { planets, miners, asteroids } from '../data/test.data'
import { MinerHistoryService } from "../service/minerHistory.service";


@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class InitJob {
    @Inject()
    minerService: MinerService;

    @Inject()
    planetService: PlanetService;

    @Inject()
    asteroidService: AsteroidService;

    @Inject()
    mineHistoryService: MinerHistoryService;

    async initDB() {
        await Promise.all([
            this.minerService.drop(),
            this.planetService.drop(),
            this.asteroidService.drop(),
            this.mineHistoryService.drop()
        ])
        const asteroidData = asteroids.map(asteroid => ({
            ...asteroid,
            curMinerals: asteroid.minerals,
            status: ASTEROID_STATUS.HAS_MINERAL
        }))
        const planetData = planets.map(planet => ({
            ...planet,
            minerals: 0
        }))
        const minerData = miners.map(miner => {
            const planet = planetData.find(p => p.id === miner.planetId)
            return {
                ...miner,
                position: planet.position,
                status: MINER_STATUS.IDLE,
                curCarry: 0,
                targetAsteroidId: undefined,
            }
        })
        await Promise.all([
            this.minerService.bulkCreate(minerData),
            this.planetService.bulkCreate(planetData),
            this.asteroidService.bulkCreate(asteroidData)
        ])

    }
}