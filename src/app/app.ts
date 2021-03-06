import { Component, ViewEncapsulation } from 'angular2/core';
import { RouteConfig, RouterOutlet, AsyncRoute } from 'angular2/router';
import { Home } from './home';
import { Header } from './header/header';
import { ProductPage } from './product-page/product-page';

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
  { path: '/browse',    name: 'Home',    component: Home,   useAsDefault: true },
  { path: '/p/:id',   name: 'Product', component: ProductPage },
])
export class App {

}
