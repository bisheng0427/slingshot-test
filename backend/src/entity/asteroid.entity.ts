import { prop } from '@typegoose/typegoose';
import { Position } from './position.entity';

export class Asteroid {
  @prop({ _id: false, type: () => Position })
  public position: Position;

  @prop()
  public name: string;

  @prop()
  public status: number;

  @prop()
  public minerals: number;

  @prop()
  public curMinerals: number;
}
