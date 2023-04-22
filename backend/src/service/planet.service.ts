import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Planet } from '../entity/planet.entity';
import { Miner } from '../entity/miner.entity';
// import { startSession } from 'mongoose';

@Provide()
export class PlanetService {
  @InjectEntityModel(Planet)
  planetModel: ReturnModelType<typeof Planet>;

  @InjectEntityModel(Miner)
  minerModel: ReturnModelType<typeof Miner>;

  async create(params: Planet) {
    return await this.planetModel.create(params as Planet);
  }

  async bulkCreate(params: Planet[]) {
    return await this.planetModel.insertMany(params)
  }

  async findOne(params: Planet) {
    return await this.planetModel
      .findOne({
        ...params,
      })
      .exec();
  }

  async getList() {
    const list = await this.planetModel.find().exec();
    return list
  }

  async update(id: number, params: Planet) {
    return await this.planetModel.updateOne(
      {
        id,
      },
      params
    );
  }

  async spawnMiner(planetId: number, params: Miner) {
    console.log('-----------spawnMiner--------------')
    const planet = await this.planetModel.findOne({ id: planetId }).exec()
    // if (planet.minerals < 1000) return { failed: true, message: 'not enough minerals' }
    const existed = await this.minerModel.findOne({ name: params.name })
    if (existed) return { failed: true, message: 'miner name existed' }
    // const session = await startSession();
    // session.startTransaction();
    try {
      console.log('create miner', params)
      const miner = await this.minerModel.create({
        ...params,
        position: planet.position,
        status: 0,
      })
      await this.planetModel.updateOne({ id: planetId }, { mineral: planet.minerals - 1000 })
      // session.commitTransaction;
      // session.endSession()
      return miner
    } catch (error) {
      // session.abortTransaction()
      // session.endSession()
      console.error(error)
      return error
    }

  }

  async drop() {
    return await this.planetModel.deleteMany()
  }
}
