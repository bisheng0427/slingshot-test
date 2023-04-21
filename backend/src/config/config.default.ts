import { MidwayConfig } from '@midwayjs/core';
import { Planet } from '../entity/planet.entity';
import { Asteroid } from '../entity/asteroid.entity';
import { Miner } from '../entity/miner.entity';
import { MinerHistory } from '../entity/minerHistory.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1681988726935_6935',
  koa: {
    port: 7001,
  },
  webSocket: {},
  mongoose: {
    dataSource: {
      default: {
        uri: 'mongodb+srv://betabb:bs270017@cluster0.gft3bo1.mongodb.net/?retryWrites=true&w=majority',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        // 关联实体
        entities: [Planet, Asteroid, Miner, MinerHistory],
      },
    },
  },
} as MidwayConfig;
