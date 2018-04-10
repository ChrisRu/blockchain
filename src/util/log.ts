import { Context } from 'koa';

export default () => async (ctx: Context, next: () => Promise<any>) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.info(`${ctx.method} ${ctx.url} in ${ms}ms`);
};
