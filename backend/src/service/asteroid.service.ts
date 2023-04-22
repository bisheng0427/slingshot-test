import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Asteroid } from '../entity/asteroid.entity';

@Provide()
export class AsteroidService {
  @InjectEntityModel(Asteroid)
  asteroidModel: ReturnModelType<typeof Asteroid>;

  async create(params: Asteroid) {
    return await this.asteroidModel.create(params as Asteroid);
  }

  async bulkCreate(params: Asteroid[]) {
    return await this.asteroidModel.insertMany(params)
  }

  async getList() {
    return await this.asteroidModel.find().exec();
  }

  async findOne(params: Asteroid) {
    return await this.asteroidModel
      .findOne({
        ...params,
      })
      .exec();
  }

  async update(_id: string, params: Asteroid) {
    return await this.asteroidModel.findByIdAndUpdate(
      _id,
      params
    );
  }

  async drop() {
    return await this.asteroidModel.deleteMany()
  }
}
