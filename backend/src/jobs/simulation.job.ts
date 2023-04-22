import { Inject } from "@midwayjs/core";
import { Job, IJob } from '@midwayjs/cron';
import { FORMAT } from '@midwayjs/core';
import { Context } from '@midwayjs/socketio';

import { MinerService } from "../service/miner.service";
import { ASTEROID_STATUS, MINER_STATUS } from "../types/common.enums";
import { PlanetService } from "../service/planet.service";
import { AsteroidService } from "../service/asteroid.service";

let idx = 0

@Job({
    cronTime: FORMAT.CRONTAB.EVERY_SECOND,
    // start: true
})
export class SimulationJob implements IJob {
    @Inject()
    ctx: Context

    @Inject()
    minerService: MinerService;

    @Inject()
    planetService: PlanetService;

    @Inject()
    asteroidService: AsteroidService;

    // to make it easy to go
    async onTick() {
        // get active miners
        const [miners, planets, asteroids] = await Promise.all([
            this.minerService.getList({}),
            this.planetService.getList(),
            this.asteroidService.getList()
        ])

        console.log('[current simulation cycle]', idx++)
        // process mining behaviour in this cycle
        for await (const asteroid of asteroids) {
            // find mining worker in this asteroid
            const miningWorkers = miners.filter(miner => miner.status === MINER_STATUS.MINING && miner.position.x === asteroid.position.x && miner.position.y === asteroid.position.y)
            if (miningWorkers.length === 0) return
            const maxMined = miningWorkers.reduce((prev, worker) => {
                const mined = worker.carryCapacity - worker.curCarry
                return prev + mined
            }, 0)
            // asteroid has enough mineral
            if (asteroid.minerals > maxMined) {
                Promise.all(miningWorkers.map(worker => {
                    // miner has exceeded its maxCapacity
                    if (worker.curCarry + worker.miningSpeed >= worker.carryCapacity) {
                        worker.status = MINER_STATUS.TRANSFERING
                        worker.curCarry = worker.carryCapacity
                        asteroid.minerals -= worker.carryCapacity - worker.curCarry
                    } else {
                        // miner has not exceeded its maxCapacity
                        worker.curCarry += worker.miningSpeed
                        asteroid.minerals -= worker.miningSpeed
                    }
                    return this.minerService.update(worker.id, worker)
                }))
                await this.asteroidService.update(asteroid._id.toString(), asteroid)
            } else {
                // asteroid has not enough mineral, each miner mined its own mienral and go back to home
                Promise.all(miningWorkers.map(worker => {
                    const mined = asteroid.minerals * (worker.miningSpeed / maxMined)
                    worker.status = MINER_STATUS.TRANSFERING
                    // miner has exceeded its maxCapacity
                    if (worker.curCarry + mined >= worker.carryCapacity) {
                        worker.curCarry = worker.carryCapacity
                    } else {
                        // miner has not exceeded its maxCapacity
                        worker.curCarry += worker.miningSpeed
                        asteroid.minerals -= worker.miningSpeed
                    }
                    return this.minerService.update(worker.id, worker)
                }))
                asteroid.minerals = 0
                asteroid.status = ASTEROID_STATUS.DEPLETED
                await this.asteroidService.update(asteroid._id.toString(), asteroid)
            }
        }


        // process each miner's behaviour in this cycle
        for await (const miner of miners) {
            switch (miner.status) {
                // if idle, assigned the miner to a random asteriod
                case MINER_STATUS.IDLE: {
                    const asteroidsGroup = asteroids.filter(asteroid => asteroid.status === ASTEROID_STATUS.HAS_MINERAL || asteroid.minerals > 0)
                    const targetAsteroid = asteroidsGroup[Math.floor(Math.random() * asteroidsGroup.length)]
                    miner.targetAsteroidId = targetAsteroid.id
                    miner.status = MINER_STATUS.TRAVELING
                    await miner.save()
                    break;
                }
                // if traveling, suppose the rest distance that miner needs to move is target postion minus current position 
                // to make the logic more simple, if miner has reached target this term, it will start mining in next cycle
                case MINER_STATUS.TRAVELING: {
                    const curPosition = miner.position
                    const targetPosition = asteroids.find(asteroid => asteroid.id === miner.targetAsteroidId).position
                    const axisChange = {
                        x: 0,
                        y: 0
                    }
                    const xDistance = Math.abs(targetPosition.x - curPosition.x)
                    const yDistance = Math.abs(targetPosition.y - curPosition.y)
                    if (miner.travelSpeed > xDistance) {
                        axisChange.x = targetPosition.x - curPosition.x > 0 ? xDistance : -xDistance
                        const restDistance = miner.travelSpeed - xDistance
                        if (restDistance > yDistance) {
                            axisChange.y = targetPosition.y - curPosition.y > 0 ? yDistance : -yDistance
                        } else {
                            axisChange.y = targetPosition.y - curPosition.y > 0 ? restDistance : -restDistance
                        }
                    } else {
                        axisChange.x = targetPosition.x - curPosition.x > 0 ? miner.travelSpeed : -miner.travelSpeed
                    }

                    miner.position = {
                        x: curPosition.x + axisChange.x,
                        y: curPosition.y + axisChange.y
                    }
                    // console.log('miner', miner.id, miner.position, axisChange)
                    if (miner.position.x === targetPosition.x && miner.position.y === targetPosition.y) {
                        miner.status = MINER_STATUS.MINING
                    }
                    await miner.save()
                    break;
                }
                case MINER_STATUS.TRANSFERING: {
                    const curPosition = miner.position
                    const target = planets.find(planet => planet.id === miner.planetId)
                    const targetPosition = target.position
                    const axisChange = {
                        x: 0,
                        y: 0
                    }
                    axisChange.x = Math.abs(targetPosition.x - curPosition.x) >= miner.travelSpeed ? targetPosition.x - curPosition.x + miner.travelSpeed : targetPosition.x;
                    axisChange.y = miner.travelSpeed - axisChange.x >= 0 ? miner.travelSpeed - axisChange.x : 0
                    miner.position = {
                        x: curPosition.x + axisChange.x,
                        y: curPosition.y + axisChange.y
                    }
                    console.log('')
                    // if arrive planet, set miner idle, transfer its' mienral to planet
                    if (miner.position.x === targetPosition.x && miner.position.y === targetPosition.y) {
                        target.minerals += miner.curCarry
                        miner.curCarry = 0
                        miner.status = MINER_STATUS.IDLE
                    }
                    await miner.save()
                    await this.planetService.update(target.id, target)
                    break
                }

                default:
                    break;
            }
        }

        // trigger cycle finished event
        const [newMiners, newPlanets, newAsteroids] = await Promise.all([
            this.minerService.getList({}),
            this.planetService.getList(),
            this.asteroidService.getList()
        ])
        this.ctx.emit('data', {
            type: 'simulation',
            data: {
                miners: newMiners,
                planets: newPlanets,
                asteroids: newAsteroids
            }
        })
    }
}