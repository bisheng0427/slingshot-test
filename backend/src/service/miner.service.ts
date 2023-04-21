import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Miner } from '../entity/miner.entity';

@Provide()
export class MinerService {
  @InjectEntityModel(Miner)
  minerModel: ReturnModelType<typeof Miner>;

  async create(params: Miner) {
    return await this.minerModel.create(params as Miner);
  }

  async getList() {
    return await this.minerModel.find().exec();
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
}
