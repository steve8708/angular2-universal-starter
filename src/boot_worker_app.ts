import 'es6-shim';
import 'es6-promise';
import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import 'zone.js/dist/long-stack-trace-zone';

import { platform, provide, ApplicationRef, ComponentRef, Injector, enableProdMode } from 'angular2/core';
import {
  WORKER_APP_PLATFORM,
  WORKER_APP_APPLICATION,
  WORKER_APP_ROUTER
} from 'angular2/platform/worker_app';
import { HTTP_PROVIDERS } from 'angular2/http';
import { APP_BASE_HREF, Router } from 'angular2/router';
import { App } from './app/lazy-app';

// TODO: only if prod config
enableProdMode();
console.log('client worker loaded');

platform(WORKER_APP_PLATFORM).asyncApplication(() => Promise.resolve([
  WORKER_APP_APPLICATION,
  WORKER_APP_ROUTER,
  HTTP_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' }),
]))
.then((appRef: ApplicationRef) => {
  return appRef.bootstrap(App, []);
})
.then((compRef: ComponentRef) => {
  const injector: Injector = compRef.injector;
  const router:   Router   = injector.get(Router);

  return (<any> router)._currentNavigation;
})
.then(() => {
  setTimeout(() => {
    postMessage('APP_READY', undefined);
  });
});

