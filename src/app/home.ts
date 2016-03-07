import { Component, NgZone, HostListener } from 'angular2/core';
import { RouteParams, Location, OnActivate, Router, ROUTER_DIRECTIVES  } from 'angular2/router';
import { Http, Headers, URLSearchParams } from 'angular2/http';
import { ProductCell } from './product-cell';
import * as _ from 'lodash';
import * as url from 'url';
import { Spinner } from './spinner/spinner';
import { Throttle } from 'lodash-decorators';

declare var require: any;
declare var zone;

const SERVER = typeof self === 'undefined' && typeof window === 'undefined';
const FIRST_LIMIT = 150;
const LIMIT = 150;

@Component({
  selector: 'home-page',
  directives: [ ProductCell, Spinner, ROUTER_DIRECTIVES ],
  template: require('./home.html'),
  styles: [require('./home.css')]
})

export class Home implements OnActivate {
  name = 'World';
  messagePreboot = '';
  messageLazyLoading = '';
  products: any[];
  productsObservable: any;
  guidedSearches: any[];
  loading = false;
  activateResolve: Function;
  activatePromise = new Promise(resolve => {
    this.activateResolve = resolve;
  });
  page = 0;

  // TODO: pagination with URLs by keeping track of offset
  constructor(
    private http: Http,
    private ngZone: NgZone,
    private params: RouteParams
  ) {
    this.getProducts();
  }

  // @HostListener('window:scroll')
  // @Throttle(1000)
  // onWindowScroll() {
  //   this.paginate();
  // }

  paginate() {
    this.getProducts(this.page + 1);
  }

  getProducts(page = 0) {
    this.page = page;

    // TODO: show load more button
    if (page > 5) {
      return;
    }

    this.loading = true;

    let url = `http://www.shopstyleqa.com/api/v2/site/search?pid=shopstyle&includeProducts=true&limit=${ page === 0 ? FIRST_LIMIT : LIMIT }&view=angular&includeGuidedSearch=true`;
    ['fl', 'cat', 'offset', 'sort', 'fts'].forEach((item) => {
      let value = this.params.get(item);

      // Default search
      if (!value && item === 'fts') {
        value = 'dresses';
      }

      if (value) {
        url += `&${item}=${value}`
      }
    });

    if (page) {
      url += `&offset=${page * LIMIT}`;
    }

    this.productsObservable = this.http.get(url);

    this.productsObservable.subscribe(res => {
      this.loading = false;
      this.ngZone.run(() => {
        const json = res.json();
        const products = json.products;

        if (page) {
          this.products.push(...products);
        } else {
          this.products = products;
          this.guidedSearches = json.metadata.guidedSearches;
        }

        setTimeout(this.activateResolve, 2);
      });
    });
  }

  routerOnActivate() {
    return this.activatePromise;
  }

  onCheckPreboot() {
    this.messagePreboot = 'Preboot is working';
  }

  onCheckLazyLoading() {
    require.ensure([], () => {
      const greeter = require('./greeter.ts');
      this.messageLazyLoading = greeter.greet();
    });
  }
}
