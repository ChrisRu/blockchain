import BlockChain from '../blockchain/Chain';
import Block from '../blockchain/Block';
import Router from 'koa-router';
import { WSServer } from 'clusterws';
import { Context } from 'koa';
import methods from '../util/methods';

export default class ChainService {
  private router: Router;
  private ws: WSServer;
  private blockChain: BlockChain;

  constructor(router: Router, ws: WSServer) {
    this.router = router;
    this.ws = ws;
    this.blockChain = new BlockChain();

    this.blockChain.createNewBlock({ test: 'value' });

    console.log(this.blockChain);
  }

  createBlock = (data: any): Block =>
    this.blockChain.add(this.blockChain.createNewBlock(data));

  getBlock = (ctx: Context): Block | undefined =>
    this.blockChain.chain.find(block => block.index === ctx.params.id);

  getBlocks = (ctx: Context): Block[] =>
    methods.send(ctx, this.blockChain.chain);
}
