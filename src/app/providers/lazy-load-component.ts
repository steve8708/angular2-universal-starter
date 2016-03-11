import { Optional, Injectable, DynamicComponentLoader, ElementRef, Component } from 'angular2/core';
import * as _ from 'lodash';

@Injectable()
export class LazyLoadComponent {
  constructor(
    private dynamicComponentLoader: DynamicComponentLoader,
    @Optional() private elementRef: ElementRef) {

  }

  loadIntoLocation(options: {
    context: any,
    template?: string,
    elementRef?: ElementRef,
    location: string,
    directives?: Function[],
    component?: Function,
    bind?: any
  }) {
    if (!options.template){
      const selector = options.component.prototype.selector;
      let bindString = '';
      _.each(options.bind, (value: string, key: string) => {
        bindString += ` ${key}="${value.replace(/"/g, '&quot;')}}"`;
      });

      options.template = `<${selector}${bindString}></${selector}`;
    }

    /* tslint:disable */
    @Component({
      // TODO: pull from template (?)
      template: options.template,
      directives: options.directives || [options.component]
    })
    class DynamicComponent {
      constructor() {
        return options.context || this;
      }
    }
    /* tslint:enable */
    // TODO: this breaks client js
    // this.dynamicComponentLoader.loadIntoLocation(DynamicComponent, options.elementRef, options.location);
  }
}
