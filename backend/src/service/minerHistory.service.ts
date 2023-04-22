import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { MinerHistory } from '../entity/minerHistory.entity';

@Provide()
export class MinerHistoryService {
    @InjectEntityModel(MinerHistory)
    minerModel: ReturnModelType<typeof MinerHistory>;

    async create(params: MinerHistory) {
        return await this.minerModel.create(params as MinerHistory);
    }

    async getList(minerId: number) {
        return await this.minerModel.find({ minerId }).exec();
    }

    async findOne(params: MinerHistory) {
        return await this.minerModel
            .findOne({
                ...params,
            })
            .exec();
    }

    async update(id: number, params: MinerHistory) {
        return await this.minerModel.updateOne(
            {
                id,
            },
            params
        );
    }
}
