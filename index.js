const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const BodyParser = require('koa-bodyparser');
const { ObjectID } = require('mongodb');

const app = new Koa();
const router = new Router();
require('./mongo')(app);

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  await next();
});

app.use(BodyParser());

router.get('/products', async (ctx) => {
  const { from = 0, to = Number.POSITIVE_INFINITY } = ctx.request.query;
  ctx.body = await ctx.app.products.find({
    price: {
      $gte: +from,
      $lte: +to,
    }
  }).toArray();
  ctx.status = 200;
});

router.post('/products', async (ctx) => {
  ctx.body = await ctx.app.products.insert(ctx.request.body);
  ctx.status = 200;
});

router.get('/products/:id', async (ctx) => {
  ctx.body = await ctx.app.products.findOne({ '_id': ObjectID(ctx.params.id) });
  ctx.status = 200;
});

router.delete('/products/:id', async (ctx) => {
  let documentQuery = { '_id': ObjectID(ctx.params.id) };
  ctx.body = await ctx.app.products.deleteOne(documentQuery);
  ctx.status = 200;
});

app.use(router.routes());
// makes sure a 405 Method Not Allowed is sent
app.use(router.allowedMethods());
app.listen(3000);