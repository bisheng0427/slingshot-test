import { prop } from '@typegoose/typegoose';
import { Position } from './position.entity';

export class Miner {
  @prop({ type: () => Position })
  public position: Position;

  @prop()
  public id: number;

  @prop()
  public planetId: number;

  @prop()
  public carryCapacity: number;

  @prop()
  public travelSpeed: number;

  @prop()
  public miningSpeed: number;

  @prop()
  public status: number;

  @prop()
  public isValid: boolean;
}
