import * as serveStatic from 'serve-static';
import * as express from 'express';
import { Request, Response } from 'express';
import { router as ngRouter } from './ng';
import { provide, enableProdMode } from 'angular2/core';
import * as _ from 'lodash';

const morgan = require('morgan');

const DEV = _.includes(['qa', 'production'], process.env.NODE_ENV);

// TODO: env variable override and env based config default
const CACHE = !DEV;

if (!DEV) {
  // TODO: causes issues when running dev server
  // enableProdMode();
}

const cache = require('express-redis-cache')({
  // TODO: configs
  host: 'localhost',
  port: 6379,
});

const app = express();

app.use(require('response-time')());
app.use(morgan('combined'));
app.use(require('compression')());

app.use('/', serveStatic(PUBLIC_DIR));

if (CACHE) {
  app.use('/', cache.route({ expire: 60 * 60 * 24 * 7 }), ngRouter);
} else {
  app.use('/', ngRouter);
}

/**
 * 404 Not Found
 */
app.use((req: Request, res: Response, next: Function) => {
  const err: any = new Error('Not Found');
  err.status = 404;

  return next(err);
});

/**
 * Errors normalization
 */
app.use((err: any, req: Request, res: Response, next: Function) => {
  const status: number = err.status || 500;

  let stack: string = err.message;
  let message: string = err.stack;

  if (message.length > 100) {
    stack = message + (stack ? ('\n\n' + stack) : '');
    message = 'Server Error';
  }

  return next({ status, message, stack });
});

/**
 * Development error handler.
 * Print error message with a stacktrace.
 */
app.use((err: any, req: Request, res: Response, next: Function) => {
  return res.status(err.status).send(`
    <h1>${err.message}<h1>
    <h2>${err.status}</h2>
    <pre>${err.stack}</pre>
  `);
});

export { app };
