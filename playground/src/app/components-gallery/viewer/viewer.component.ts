import { Component, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { routeToComponent } from '../previews';
import { TakeUntilDestroy, OnDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'dato-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  destroyed$: Observable<boolean>;
  private klass: ComponentRef<any>;

  constructor(private route: ActivatedRoute, private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(paramsMap => paramsMap.get('id')),
      map(id => routeToComponent[id]),
      takeUntil(this.destroyed$)
    ).subscribe(this.createComponent.bind(this));
  }

  /**
   *
   * @param {Type<any>} component
   */
  createComponent(component: Type<any>) {
    this.klass && this.klass.destroy();
    const factory = this.resolver.resolveComponentFactory(component);
    this.klass = this.container.createComponent(factory);
  }

  ngOnDestroy() {
  }

}
