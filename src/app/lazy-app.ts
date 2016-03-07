import { Component, ViewEncapsulation } from 'angular2/core';
import { RouteConfig, RouterOutlet, AsyncRoute } from 'angular2/router';
import { Header } from './header/header';

declare var require: any;

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [ require('./app.css') ],
  directives: [ RouterOutlet, Header ],
  template: `
    <header></header>
    <router-outlet></router-outlet>
  `
})
// TODO: global pagination handler
// TODO: separate server app with all async routes (?)
// or regex text replace in webpack (?)
@RouteConfig([
  new AsyncRoute({
    path: '/p/:id',
    name: 'Product',
    loader: () => new Promise((resolve) => {
      require.ensure([], () => {
        resolve(require('./product-page/product-page').ProductPage);
      });
    })
  }),
  new AsyncRoute({
    path: '/browse',
    name: 'Home',
    loader: () => new Promise((resolve) => {
      require.ensure([], () => {
        resolve(require('./home').Home);
      });
    }),
    useAsDefault: true
  }),
])
export class App {

}
