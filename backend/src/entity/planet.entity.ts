import { prop } from '@typegoose/typegoose';
import { Position } from './position.entity';

export class Planet {
  @prop()
  id: number;

  @prop()
  name: string;

  @prop({ _id: false, type: () => Position })
  public position: Position;

  @prop()
  public minerals: number;
}
