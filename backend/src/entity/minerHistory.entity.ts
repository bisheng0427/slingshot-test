import { prop } from '@typegoose/typegoose';
import { Position } from './position.entity';

export class MinerHistory {
  @prop()
  minerId: number;

  @prop()
  date: string;

  @prop()
  year: string;

  @prop()
  carryCapacity: number;

  @prop()
  public travelSpeed: number;

  @prop()
  public miningSpeed: number;

  @prop({ type: () => Position })
  public position: Position;

  @prop()
  action: string;

  @prop()
  time: string;

  @prop()
  status: string;
}
