import { Server } from 'http';
import Koa, { Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
// @ts-ignore
import cors from '@koa/cors';
import ClusterWS, { Configurations, WSServer, Socket } from 'clusterws';
import log from './util/log';
import config from './util/config';
import ChainService from './services/ChainService';

const configurations: Configurations = {
  worker: Worker,
  port: config.port
};

function Worker(): void {
  // @ts-ignore
  const wss: WSServer = this.wss;
  // @ts-ignore
  const server: Server = this.server;
  const app = new Koa();
  const router = new Router();
  const chainService = new ChainService(router, wss);

  app.use(log());
  app.use(bodyParser());
  app.use(cors());
  app.use(router.routes());
  app.use(router.allowedMethods());

  router.get('/block/:id', chainService.getBlock);
  router.get('/blocks', chainService.getBlocks);
  router.post('/mine', chainService.createBlock);
  router.post('/create', chainService.createBlock);

  server.on('request', app.callback());
  wss.on('connection', (socket: Socket): void => {
    socket.on('message', data => {
      console.log(data);
    });
  });
}

const clusterws: ClusterWS = new ClusterWS(configurations);
