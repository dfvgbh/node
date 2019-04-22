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
  await next();
});

app.use(BodyParser());

router.get('/todos', async (ctx) => {
  ctx.body = [
    {
      id: 1,
      text: 'Switch to Koa',
      completed: true
    }, {
      id: 2,
      text: '???',
      completed: false
    }, {
      id: 3,
      text: 'Profit',
      completed: true
    }, {
      id: 4,
      text: 'Apple',
      completed: true
    }, {
      id: 5,
      text: 'Peach',
      completed: true
    }, {
      id: 6,
      text: 'Avocado',
      completed: false
    }, {
      id: 7,
      text: 'Mango',
      completed: true
    }, {
      id: 8,
      text: 'Papaya',
      completed: true
    }
  ];
  ctx.status = 200;
});

router.get('/people', async (ctx) => {
  ctx.body = await ctx.app.people.find().toArray();
  ctx.status = 200;
});

router.post('/people', async (ctx) => {
  ctx.body = await ctx.app.people.insert(ctx.request.body);
});

router.get('/people/:id', async (ctx) => {
  ctx.body = await ctx.app.people.findOne({ '_id': ObjectID(ctx.params.id) });
});

router.delete('/people/:id', async (ctx) => {
  let documentQuery = { '_id': ObjectID(ctx.params.id) }; 
  ctx.body = await ctx.app.people.deleteOne(documentQuery);
});

app.use(router.routes());
// makes sure a 405 Method Not Allowed is sent
app.use(router.allowedMethods());
app.listen(3000);