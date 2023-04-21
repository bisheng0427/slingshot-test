import { prop } from '@typegoose/typegoose';

export class MinerHistory {
  @prop()
  action: string;

  @prop()
  time: string;
}
