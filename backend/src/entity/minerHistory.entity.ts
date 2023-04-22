import { prop } from '@typegoose/typegoose';
import { Position } from './position.entity';

export class MinerHistory {
  @prop()
  minerId: number;

  @prop()
  year: number;

  @prop({ type: () => Position })
  public position: Position;

  @prop()
  action: string;

  @prop()
  status: string;
}
