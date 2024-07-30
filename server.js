const Koa = require('koa');
const slow = require('koa-slow')
const http = require('http');
const { faker } = require('@faker-js/faker');

const app = new Koa();
const server = http.createServer(app.callback());
const port = process.env.PORT || 7070;

app.use(slow({
  delay: 2000,
}));

app.use((ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Accept', 'application/json');
  ctx.response.set('Content-Type', 'application/json');

  next();
});

app.use((ctx, next) => {
  const news = faker.helpers.multiple(() => {
    return {
      "id": faker.string.uuid(),
      "title": faker.lorem.sentence({ min: 3, max: 5 }),
      "announcement": faker.lorem.sentences(2),
      "image": faker.image.urlLoremFlickr(),
    }
  }, {
    count: 5,
  });

  ctx.response.body = {
    "status": "ok",
    "timestamp": Date.now(),
    "news": news
  }
});

server.listen(port, error => {
  if (error) {
    console.error(error);

    return;
  }

  console.log(`Server is listening to port ${port}...`);
});
