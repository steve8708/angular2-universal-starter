import { Router, Request, Response } from 'express';
import { provide } from 'angular2/core';
import { PlatformLocation, APP_BASE_HREF, ROUTER_PROVIDERS } from 'angular2/router';
import {
  REQUEST_URL,
  SERVER_LOCATION_PROVIDERS,
  selectorResolver,
  selectorRegExpFactory,
  renderToStringWithPreboot,
  NODE_HTTP_PROVIDERS
} from 'angular2-universal-preview';

import { App } from '../app/app';

function reduceScripts(content, src) {
  return `${content}<script type="text/javascript" src="${src}"></script>`;
}

const WORKER_SCRIPTS  = [`${VENDOR_NAME}.js`, `${WORKER_NAME}.js`].reduce(reduceScripts, '');
const BROWSER_SCRIPTS = [`${VENDOR_NAME}.js`, `${BROWSER_NAME}.js`].reduce(reduceScripts, '');

const HTML_FILE = require('./ng.html');

export function renderComponent(html, component, providers, prebootOptions) {
  return renderToStringWithPreboot(component, providers, prebootOptions).then((serializedCmp) => {
    const selector: string = selectorResolver(component);

    return html.replace(selectorRegExpFactory(selector), serializedCmp);
  });
}

const PROVIDERS = [
  ROUTER_PROVIDERS,
  SERVER_LOCATION_PROVIDERS,
  NODE_HTTP_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' }),
];

const router = Router();

/**
 * Angular2 application
 */
router.get('/*', (req: Request, res: Response, next: Function) => {
  console.log('\n\n - - GET - - ', req.url);

  return Promise.resolve()
    .then(() => {
      if (HAS_SS) {
        const REQUEST_PROVIDERS = [
          provide(REQUEST_URL,  { useValue: req.originalUrl })
        ];

        return renderComponent(HTML_FILE, App, [PROVIDERS, REQUEST_PROVIDERS], PREBOOT);
      }

      return HTML_FILE;
    })
    .then((rawContent) => {
      const scripts = HAS_WW ? WORKER_SCRIPTS : BROWSER_SCRIPTS;
      const content = rawContent.replace('</body>', scripts + '</body>');

      console.log('SENDING');
      return res.send(content);
    })
    .catch(error => next(error));
});

export { router };
