import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Planet } from '../entity/planet.entity';
import { Miner } from '../entity/miner.entity';
import { startSession } from 'mongoose';

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
    return await this.planetModel.find().exec();
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
    const planet = await this.planetModel.findOne({ id: planetId }).exec()
    if (planet.minerals < 1000) return false
    const session = await startSession();
    session.startTransaction();
    try {
      const miner = await this.minerModel.create(params)
      await this.planetModel.updateOne({ id: planetId }, { mineral: planet.minerals - 1000 })
      session.commitTransaction;
      session.endSession()
      return miner
    } catch (error) {
      session.abortTransaction()
      session.endSession()
      return error
    }

  }

  async drop() {
    return await this.planetModel.deleteMany()
  }
}
