import { App, Init, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { Context, Application } from '@midwayjs/socketio';
import { EventEmitter } from 'koa';


@Provide()
@Scope(ScopeEnum.Singleton)
export class EventService {
    public eventEmitter: EventEmitter

    @Inject()
    ctx: Context

    @App('socketIO')
    socketApp: Application

    @Init()
    async init() {
        console.log('init boradcast')
        this.eventEmitter = new EventEmitter();
    }
}
