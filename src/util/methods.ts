import { Context } from 'koa';

export default {
  send<T>(ctx: Context, data: T, type: string = 'application/json'): T {
    let body: string;

    if (ctx.type === 'application/json' || typeof data === 'object') {
      body = JSON.stringify(data);
    } else {
      body = String(data);
    }

    ctx.type = type;
    ctx.body = body;

    return data;
  },

  throw(ctx: Context, error: any, code: number): void {
    ctx.throw(code, error);
  }
};
