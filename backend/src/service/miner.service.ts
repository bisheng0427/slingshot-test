import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Miner } from '../entity/miner.entity';
import { FilterQuery } from 'mongoose';

@Provide()
export class MinerService {
  @InjectEntityModel(Miner)
  minerModel: ReturnModelType<typeof Miner>;

  async create(params: Miner) {
    return await this.minerModel.create(params as Miner);
  }

  async bulkCreate(params: Miner[]) {
    return await this.minerModel.insertMany(params)
  }

  async getList(params: FilterQuery<Miner>) {
    return await this.minerModel.find(params).exec();
  }

  async findOne(params: Miner) {
    return await this.minerModel
      .findOne({
        ...params,
      })
      .exec();
  }

  async update(id: number, params: Miner) {
    return await this.minerModel.updateOne(
      {
        id,
      },
      params
    );
  }

  async drop() {
    return await this.minerModel.deleteMany()
  }
}
