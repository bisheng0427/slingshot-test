import { Configuration, App, Inject } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as typegoose from '@midwayjs/typegoose';
import * as Typegoose from '@typegoose/typegoose';
// import * as ws from '@midwayjs/ws';
import * as socketio from '@midwayjs/socketio';
import * as crossDomain from '@midwayjs/cross-domain';
import * as cron from '@midwayjs/cron';
import { InjectJob, CronJob } from '@midwayjs/cron';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { InitJob } from './jobs/init.job';
import { SimulationJob } from './jobs/simulation.job'

@Configuration({
  imports: [
    koa,
    validate,
    typegoose,
    socketio,
    crossDomain,
    cron,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  @Inject()
  initJob: InitJob

  @InjectJob(SimulationJob)
  simulationJob: CronJob;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    Typegoose.setGlobalOptions({
      options: { allowMixed: Typegoose.Severity.ALLOW },
    });

    await this.initJob.initDB()
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }

  async onServerReady() {
    this.simulationJob.start()
  }
}
