import { AfterContentChecked, AfterContentInit, Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { addClass, setStyle } from '../internal/helpers';
import { debounce } from 'helpful-decorators';

let nextId = 0;

/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
@Directive({ selector: 'ng-template[datoTabTitle]' })
export class DatoTabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({ selector: 'ng-template[datoTabContent]' })
export class DatoTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * A directive representing an individual tab.
 */
@Directive({ selector: 'dato-tab' })
export class DatoTab {
  /**
   * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
   */
  @Input() id = `dato-tab-${nextId++}`;

  /**
   * Simple (string only) title. Use the "DatoTabTitle" directive for more complex use-cases.
   */
  @Input() title: string;

  /**
   * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
   */
  @Input() disabled = false;

  @Input() className = '';

  titleTpl: DatoTabTitle | null;
  contentTpl: DatoTabContent | null;

  @ContentChildren(DatoTabTitle, { descendants: false })
  titleTpls: QueryList<DatoTabTitle>;
  @ContentChildren(DatoTabContent, { descendants: false })
  contentTpls: QueryList<DatoTabContent>;

  ngAfterContentChecked() {
    this.titleTpl = this.titleTpls.first;
    this.contentTpl = this.contentTpls.first;
  }
}

/**
 * The payload of the change event fired right before the tab change
 */
export interface DatoTabChangeEvent {
  /**
   * Id of the currently active tab
   */
  activeId: string;

  /**
   * Id of the newly selected tab
   */
  nextId: string;

  /**
   * Function that will prevent tab switch if called
   */
  preventDefault: () => void;
}

@Component({
  selector: 'dato-tabset',
  templateUrl: './tabs.component.html',
  exportAs: 'datoTabset',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoTabset implements AfterContentChecked, AfterContentInit {
  @ContentChildren(DatoTab) tabs: QueryList<DatoTab>;

  /**
   * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
   */
  @Input() activeId: string;

  /**
   * Whether the closed tabs should be hidden without destroying them
   */
  @Input() destroyOnHide = true;

  /**
   * A tab change event fired right before the tab selection happens. See DatoTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<DatoTabChangeEvent>();

  constructor(private cdr: ChangeDetectorRef, private host: ElementRef, @Attribute('datoVertical') public datoVertical, @Attribute('datoNakedActive') public datoNakedActive) {
    this.datoVertical && addClass(this.host.nativeElement, 'dato-tabs--vertical');
    this.datoNakedActive && addClass(this.host.nativeElement, 'dato-tabs--clean');
  }

  /**
   * Selects the tab with the given id and shows its associated pane.
   * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
   */
  select(tabId: string) {
    let selectedTab = this._getTabById(tabId);
    if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
      let defaultPrevented = false;

      this.tabChange.emit({
        activeId: this.activeId,
        nextId: selectedTab.id,
        preventDefault: () => {
          defaultPrevented = true;
        }
      });

      if (!defaultPrevented) {
        this.activeId = selectedTab.id;
        this.movePointer();
      }
    }
    this.cdr.markForCheck();
  }

  ngAfterContentChecked() {
    // auto-correct activeId that might have been set incorrectly as input
    let activeTab = this._getTabById(this.activeId);
    this.activeId = activeTab ? activeTab.id : this.tabs.length ? this.tabs.first.id : null;
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.movePointer();
    });
  }

  @HostListener('window:resize', ['$event'])
  @debounce(100)
  private onResize() {
    this.movePointer();
  }

  private movePointer() {
    if (!this.datoVertical && !this.datoNakedActive && this.activeId) {
      const activeTab = this._getTabById(this.activeId);
      let element = this.host.nativeElement.querySelector(`#${activeTab.id}`) as HTMLElement;

      if (element) {
        element = element.parentNode as HTMLElement;
        const pointer = this.getPointer();
        setStyle(pointer, 'width', `${element.clientWidth}px`);
        setStyle(pointer, 'transform', `translateX(${element.offsetLeft}px)`);
      }
    }
  }

  private getPointer() {
    return this.host.nativeElement.querySelector('.tab-pointer');
  }

  private _getTabById(id: string): DatoTab {
    let tabsWithId: DatoTab[] = this.tabs.filter(tab => tab.id === id);
    return tabsWithId.length ? tabsWithId[0] : null;
  }
}
