import { Input, Injectable, Component, NgZone, HostListener, ElementRef, DynamicComponentLoader } from 'angular2/core';
import { RouteParams, Location, OnActivate, Router, ROUTER_DIRECTIVES  } from 'angular2/router';
import { Http, Headers, URLSearchParams } from 'angular2/http';
import { ProductCell } from './product-cell';
import * as _ from 'lodash';
import * as url from 'url';
import { Spinner } from './spinner/spinner';
import { Throttle, Bind } from 'lodash-decorators';
import { LazyLoadComponent } from './providers/lazy-load-component';

declare var require: any;
declare var zone;

const SERVER = typeof self === 'undefined' && typeof window === 'undefined';

const FIRST_LIMIT = 50;
const LIMIT = 50;

@Component({
  selector: 'home-page',
  directives: [ ProductCell, Spinner, ROUTER_DIRECTIVES, /* SearchFilters */ ],
  template: require('./home.html'),
  styles: [require('./home.css')],
  providers: [ LazyLoadComponent ]
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
  page: number;
  LIMIT = LIMIT;
  fts: string;

  defaultGuidedSearches = [
    { text: 'Women' },
    { text: 'Men' },
    { text: 'Kids' },
    { text: 'Home' },
    { text: 'Bags' },
    { text: 'Shoes' },
    { text: 'Bridal' },
    { text: 'Denim' },
    { text: 'Accessories' },
    { text: 'Activewear' },
    { text: 'Outerwear' },
    { text: 'Swimwear' },
    { text: 'Jackets' },
    { text: 'Pants' },
    { text: 'Petites' },
    { text: 'Plus Sizes' },
    { text: 'Shorts' },
  ];

  // TODO: pagination with URLs by keeping track of offset
  constructor(
    private http: Http,
    private ngZone: NgZone,
    private params: RouteParams,
    private elementRef: ElementRef,
    private dynamicComponentLoader: DynamicComponentLoader,
    private lazyLoadComponent: LazyLoadComponent
  ) {

  }

  ngOnInit() {
    this.page = parseInt(this.params.get('offset')) / LIMIT || 0
    this.fts = this.params.get('fts') || 'dresses';
    this.getProducts(this.page);

    // TODO: on destroy remove this listener!
    if (!SERVER) {
      self.addEventListener('message', this.scrollMessageListener, false);

      require.ensure([], () => {
        const { SearchFilters } = require('./search-filters/search-filters');
        this.lazyLoadComponent.loadIntoLocation({
          context: this,
          component: SearchFilters,
          bind: {
            '[show]': 'showFilters',
            '(update)': 'update($event)'
          },
          location: 'searchFilters',
        });
      });
    }
  }

  // Filters updated, update search and URL
  update(event: any) {

  }

  @Bind(undefined)
  scrollMessageListener(event) {
    const { data } = event;
    if (data && data.name === 'window.scroll') {
      const { windowHeight, bodyHeight, bodyScrollTop } = data;
      // Maybe window inner height
      const BUFFER_SIZE = 3000;

      if (bodyHeight - (windowHeight + bodyScrollTop) < BUFFER_SIZE ) {
        this.paginate();
      }
    }
  }

  ngOnDestroy() {
    if (!SERVER) {
      self.removeEventListener('message', this.scrollMessageListener, false);
    }
  }

  // @HostListener(INFINITE_SCROLL ? 'window:scroll' : 'dummyEvent')
  @Throttle(100)
  throttledPaginate() {
    this.paginate();
  }

  paginate() {
    this.getProducts(this.page + 1, true);
  }

  getProducts(page = 0, infiniteScroll = false) {
    if (infiniteScroll && this.loading) {
      return;
    }

    this.page = page;

    // TODO: show load more button
    // if (page > 5) {
    //   return;
    // }

    this.loading = true;

    let url = `https://www.shopstyleqa.com/api/v2/site/search?pid=shopstyle&includeProducts=true&limit=${ page === 0 ? FIRST_LIMIT : LIMIT }&view=angular&includeGuidedSearch=true`;
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

        if (page && infiniteScroll) {
          this.products.push(...products);
        } else {
          this.products = products;
          this.guidedSearches = json.metadata.guidedSearches;
          if (!this.guidedSearches && this.guidedSearches.length) {
            this.guidedSearches = this.defaultGuidedSearches;
          }
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
}
