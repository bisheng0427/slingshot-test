import { prop } from '@typegoose/typegoose';
import { Miner } from './miner.entity';
import { Position } from './position.entity';

export class Planet {
  @prop()
  id: number;

  @prop({ type: () => Position })
  public position: Position;

  @prop()
  public mineral: number;

  @prop({ type: () => [Miner] })
  public miners: Miner[];

  @prop()
  public isValid: boolean;
}
