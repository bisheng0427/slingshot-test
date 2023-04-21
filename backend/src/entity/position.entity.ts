import { prop } from '@typegoose/typegoose';

export class Position {
  @prop()
  x: number;

  @prop()
  y: number;
}
