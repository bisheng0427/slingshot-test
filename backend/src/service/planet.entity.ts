import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Planet } from '../entity/planet.entity';

@Provide()
export class PlanetService {
  @InjectEntityModel(Planet)
  planetModel: ReturnModelType<typeof Planet>;

  async create(params: Planet) {
    return await this.planetModel.create(params as Planet);
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
}
