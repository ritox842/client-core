import { DatoSelectComponent } from './select.component';
import { createHostComponentFactory, dispatchFakeEvent, dispatchKeyboardEvent, query, queryAll, SpectatorWithHost, typeInElement } from '@netbasal/spectator';
import { DatoTriggerMulti } from './trigger-multi/trigger-multi.component';
import { DatoButtonModule, DatoCheckboxModule, DatoIconModule, DatoInputModule, DatoLinkButtonModule, DatoSelectEmptyComponent, DatoMultiOptionComponent, DatoOptionComponent, DatoTranslateService, DatoTriggerSingle, IconRegistry } from '../..';
import { DatoOverlay } from '../angular/overlay';
import { DatoSelectActiveDirective } from './select-active.directive';
import { DatoGroupComponent } from '../options/group.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, Type } from '@angular/core';
import { stubs } from '../services/public_api';
import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Subject, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

function generateOptions() {
  const arr = [];
  for (var i = 0, len = 15; i < len; i++) {
    arr.push({
      label: `Item ${i + 1}`,
      id: i + 1
    });
  }
  return arr;
}

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  control = new FormControl();
  options = generateOptions();

  save() {}
}

@Component({ selector: 'custom-host', template: '' })
class AsyncComponent extends CustomHostComponent {
  subject = new Subject();
  options$ = this.subject.asObservable();

  constructor() {
    super();
    setTimeout(() => {
      this.subject.next(this.options);
    }, 500);
  }
}

@Component({ selector: 'custom-host', template: '' })
class GroupComponent extends CustomHostComponent {
  options = [
    {
      label: 'Group A',
      children: [{ id: 1, label: 'abc' }, { id: 2, label: 'efg' }, { id: 3, label: 'hij' }]
    },
    {
      label: 'Group B',
      children: [{ id: 4, label: 'klm' }]
    },
    {
      label: 'Group C',
      children: [{ id: 5, label: 'nop' }]
    }
  ];
  subject = new Subject();
  options$ = this.subject.asObservable();

  constructor() {
    super();
    setTimeout(() => {
      this.subject.next(this.options);
    }, 500);
  }
}

@Component({ selector: 'custom-host', template: '' })
class ServerSearchComponent extends CustomHostComponent {
  isLoading = false;

  _optionsFromServer = [
    { id: 1, label: 'abc' },
    { id: 2, label: 'efg' },
    { id: 3, label: 'hij' },
    {
      id: 4,
      label: 'klm'
    },
    { id: 5, label: 'nop' }
  ];

  constructor() {
    super();
  }

  onSearch(term: string) {
    this.getNewItems(term).subscribe(res => {
      this.options = res;
      this.isLoading = false;
    });
  }

  getNewItems(term) {
    this.isLoading = true;

    return timer(500).pipe(mapTo(this._optionsFromServer.filter(item => item.label.includes(term))));
  }
}

function createHostFactory<T>(host: Type<T>) {
  return createHostComponentFactory({
    component: DatoSelectComponent,
    host,
    declarations: [DatoTriggerSingle, DatoTriggerMulti, DatoSelectActiveDirective, DatoSelectEmptyComponent, DatoGroupComponent, DatoOptionComponent, DatoMultiOptionComponent],
    providers: [DatoOverlay, DatoTranslateService, stubs.translate(), IconRegistry],
    imports: [DatoIconModule, DatoInputModule, ReactiveFormsModule, DatoCheckboxModule, DatoLinkButtonModule, DatoButtonModule]
  });
}

const DROPDOWN_SELECTOR = '.dato-select__dropdown-container';
const TRIGGER_SINGLE_SELECTOR = 'dato-trigger-single';
const TRIGGER_MULTI_SELECTOR = 'dato-trigger-multi';
const OPTION_SELECTOR = 'dato-option';
const GROUP_SELECTOR = 'dato-group';
const SELECT_SELECTOR = 'dato-select';

describe('DatoSelect', () => {
  describe('Select Single - No Search', () => {
    let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options" [isCombo]="false" #datoSelectSimple>

        <dato-option *ngFor="let option of datoSelectSimple.data; index as index" [option]="option" [disabled]="index === 1">
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

    it('should be define', () => {
      host = createHost(select);
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toBeDefined();
    });

    it('should toggle the dropdown', () => {
      host = createHost(select);
      host.click(TRIGGER_SINGLE_SELECTOR);
      expect(query(DROPDOWN_SELECTOR)).toBeDefined();
      host.click(TRIGGER_SINGLE_SELECTOR);
      expect(query(DROPDOWN_SELECTOR)).toBeNull();
    });

    it(
      'should select the option and close the dropdown',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        host.click(query(OPTION_SELECTOR));
        tick(11);
        expect(query(DROPDOWN_SELECTOR)).toBeNull();
        expect(host.hostComponent.control.value).toEqual({ id: 1, label: 'Item 1' });
        host.hostFixture.detectChanges();
        expect(host.query(TRIGGER_SINGLE_SELECTOR)).toHaveText('Item 1');
      })
    );

    it('should close the dropdown on escape', () => {
      host = createHost(select);
      host.click(TRIGGER_SINGLE_SELECTOR);
      expect(query(DROPDOWN_SELECTOR)).toBeDefined();
      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      expect(query(DROPDOWN_SELECTOR)).toBeNull();
    });

    it('should NOT display search box', () => {
      host = createHost(select);
      host.click(TRIGGER_SINGLE_SELECTOR);
      expect(query('.dato-select__single dato-input')).toHaveClass('force-hide');
    });

    it('should show placeholder when control is empty', () => {
      host = createHost(select);
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toHaveText('general.select');
    });

    it('should show placeholder when control the is empty', () => {
      host = createHost(select);
      expect(host.query(TRIGGER_SINGLE_SELECTOR).querySelector('.dato-select__placeholder')).toBeVisible();
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toHaveText('general.select');
    });

    it('should NOT show placeholder when the control value is defined', () => {
      host = createHost(select);
      expect(host.query(TRIGGER_SINGLE_SELECTOR).querySelector('.dato-select__placeholder')).toBeVisible();
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toHaveText('general.select');
      host.hostComponent.control.patchValue({ id: 1, label: 'Item 1' });
      host.detectChanges();
      expect(host.query(TRIGGER_SINGLE_SELECTOR).querySelector('.dato-select__placeholder')).not.toBeVisible();
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toHaveText('Item 1');
    });
  });

  describe('Select Single - Async', () => {
    let host: SpectatorWithHost<DatoSelectComponent, AsyncComponent>;

    const createHost = createHostFactory(AsyncComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options$ | async" #datoSelectAsync>

        <dato-option *ngFor="let option of datoSelectAsync.data; index as index" [option]="option" [disabled]="index === 1">
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

    it('should be define', () => {
      host = createHost(select);
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toBeDefined();
    });

    it(
      'should work with async',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        expect(queryAll(OPTION_SELECTOR).length).toEqual(0);
        tick(501);
        host.hostFixture.detectChanges();
        expect(queryAll(OPTION_SELECTOR).length).toEqual(15);
      })
    );

    it(
      'should work with later updates',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        expect(queryAll(OPTION_SELECTOR).length).toEqual(0);
        tick(501);
        host.hostFixture.detectChanges();
        expect(queryAll(OPTION_SELECTOR).length).toEqual(15);
        host.hostComponent.subject.next([...host.hostComponent.options, { id: 16, label: 'Item 16' }]);
        host.hostFixture.detectChanges();
        expect(queryAll(OPTION_SELECTOR).length).toEqual(16);
      })
    );
  });

  describe('Select Single - With Search', () => {
    let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectSimple>

        <dato-option *ngFor="let option of datoSelectSimple.data; index as index" [option]="option" [disabled]="index === 1">
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

    it('should show the search on click', () => {
      host = createHost(select);
      host.click(TRIGGER_SINGLE_SELECTOR);
      expect(query('.dato-select__single dato-input')).toBeVisible();
    });

    it(
      'should filter by search term',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        typeInElement('12', query('.dato-select__single .dato-input'));
        tick(301);
        expect(host.component.options.filter(datoOption => datoOption.disabled).length).toEqual(14);
        expect(host.component.options.filter(datoOption => datoOption.hide).length).toEqual(14);
        expect(getOptionsAsArray().filter(isOptionHidden).length).toEqual(14);
        typeInElement('', query('.dato-select__single .dato-input'));
        tick(301);
        /** We have one initial disabled */
        expect(host.component.options.filter(datoOption => datoOption.disabled).length).toEqual(1);
        expect(host.component.options.filter(datoOption => datoOption.hide).length).toEqual(0);
        expect(getOptionsAsArray().filter(isOptionHidden).length).toEqual(0);
      })
    );

    it(
      'should select & search term',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        typeInElement('12', query('.dato-select__single .dato-input'));
        tick(301);
        host.detectChanges();
        expect(getOptionsAsArray().filter(isOptionHidden).length).toEqual(14);
        const visibleOption = getOptionsAsArray().filter(el => !isOptionHidden(el))[0];
        visibleOption.click();
        tick(312);
        host.detectChanges();
        expect(host.query(TRIGGER_SINGLE_SELECTOR)).toHaveText('Item 12');
        expect(host.hostComponent.control.value).toEqual({ id: 12, label: 'Item 12' });
      })
    );

    it(
      'should show no items message',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        typeInElement('something that doesnt exists', query('.dato-select__single .dato-input'));
        tick(301);
        host.detectChanges();
        expect(query('.dato-select__not-found')).toBeVisible();
        typeInElement('12', query('.dato-select__single .dato-input'));
        tick(301);
        expect(query('.dato-select__not-found')).not.toBeVisible();
      })
    );
  });

  describe('Server Side Search', () => {
    let host: SpectatorWithHost<DatoSelectComponent, ServerSearchComponent>;

    const createHost = createHostFactory(ServerSearchComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options"
                   (search)="onSearch($event)"
                   [isLoading]="isLoading"
                   [internalSearch]="false"
                   #datoSelectServer>

        <dato-option *ngFor="let option of datoSelectServer.data" [option]="option">
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

    it(
      'should peform a server side search',
      fakeAsync(() => {
        host = createHost(select);
        spyOn(host.hostComponent, 'onSearch').and.callThrough();
        host.click(TRIGGER_SINGLE_SELECTOR);
        typeInElement('a', query('.dato-select__single .dato-input'));
        tick(301);
        host.detectChanges();
        expect(host.query('.dato-input__spinner')).toBeVisible();
        tick(801);
        host.detectChanges();
        expect(host.query('.dato-input__spinner')).not.toBeVisible();
        expect(host.hostComponent.onSearch).toHaveBeenCalledWith('a');
        expect(queryAll(OPTION_SELECTOR).length).toEqual(1);
        host.click('.dato-icon-close');
        tick(1200);
        host.detectChanges();
        expect(queryAll(OPTION_SELECTOR).length).toEqual(5);
      })
    );
  });

  describe('Select Multi', () => {
    let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectSearch3 type="multi">

        <dato-option *ngFor="let option of datoSelectSearch3.data" [option]="option" multi>
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

    it('should be define', () => {
      host = createHost(select);
      expect(host.query(TRIGGER_MULTI_SELECTOR)).toBeDefined();
    });

    it('should toggle the dropdown', () => {
      host = createHost(select);
      host.click(TRIGGER_MULTI_SELECTOR);
      expect(query(DROPDOWN_SELECTOR)).toBeDefined();
      host.click(document.body);
      expect(query(DROPDOWN_SELECTOR)).toBeNull();
    });

    it('should NOT close the dropdown when clicking again on the input', () => {
      host = createHost(select);
      host.click(TRIGGER_MULTI_SELECTOR);
      expect(query(DROPDOWN_SELECTOR)).toBeDefined();
      host.click(TRIGGER_MULTI_SELECTOR);
      expect(query(DROPDOWN_SELECTOR)).toBeDefined();
    });

    it('should show the search on click', () => {
      host = createHost(select);
      host.click(TRIGGER_MULTI_SELECTOR);
      expect(query('.dato-multi-search')).toBeVisible();
    });

    it(
      'should select multiple',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        const [one, two, three, four] = getOptionsAsArray();
        one.click();
        tick(11);
        two.click();
        tick(22);
        three.click();
        tick(33);
        host.detectChanges();
        expect(host.hostComponent.control.value).toEqual([
          {
            id: 1,
            label: 'Item 1'
          },
          {
            id: 2,
            label: 'Item 2'
          },
          {
            id: 3,
            label: 'Item 3'
          }
        ]);
        expect(queryAll('.dato-trigger-multi__active').length).toEqual(3);
        expect(queryAll('.dato-checkbox').length).toEqual(15);
        expect(one.querySelector('input[type="checkbox"]')).toBeChecked();
        expect(two.querySelector('input[type="checkbox"]')).toBeChecked();
        expect(three.querySelector('input[type="checkbox"]')).toBeChecked();
        expect(four.querySelector('input[type="checkbox"]')).not.toBeChecked();
      })
    );

    it(
      'should remove items',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        const [one] = getOptionsAsArray();
        one.click();
        tick(11);
        host.detectChanges();
        expect(host.hostComponent.control.value).toEqual([
          {
            id: 1,
            label: 'Item 1'
          }
        ]);
        expect(queryAll('.dato-trigger-multi__active').length).toEqual(1);
        expect(one.querySelector('input[type="checkbox"]')).toBeChecked();
        query('.dato-trigger-multi__active .dato-icon-close').click();
        host.detectChanges();
        expect(host.hostComponent.control.value).toEqual([]);
        expect(queryAll('.dato-trigger-multi__active').length).toEqual(0);
        expect(one.querySelector('input[type="checkbox"]')).not.toBeChecked();
      })
    );

    it(
      'should not remove when clicking the item and not the X',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        const [one] = getOptionsAsArray();
        one.click();
        tick(11);
        host.detectChanges();
        expect(host.hostComponent.control.value).toEqual([
          {
            id: 1,
            label: 'Item 1'
          }
        ]);
        expect(queryAll('.dato-trigger-multi__active').length).toEqual(1);
        expect(one.querySelector('input[type="checkbox"]')).toBeChecked();
        query('.dato-trigger-multi__active').click();
        host.detectChanges();
        expect(host.hostComponent.control.value).toEqual([
          {
            id: 1,
            label: 'Item 1'
          }
        ]);
        expect(queryAll('.dato-trigger-multi__active').length).toEqual(1);
        expect(one.querySelector('input[type="checkbox"]')).toBeChecked();
      })
    );

    it(
      'should set the items based on the form control',
      fakeAsync(() => {
        host = createHost(select);
        expect(host.hostComponent.control.value).toEqual(null);
        host.hostComponent.control.patchValue([
          {
            id: 1,
            label: 'Item 1'
          },
          {
            id: 2,
            label: 'Item 2'
          },
          {
            id: 3,
            label: 'Item 3'
          }
        ]);
        host.click(TRIGGER_MULTI_SELECTOR);
        host.detectChanges();
        const [one, two, three, four] = getOptionsAsArray();
        expect(queryAll('.dato-trigger-multi__active').length).toEqual(3);
        expect(queryAll('.dato-checkbox').length).toEqual(15);
        expect(one.querySelector('input[type="checkbox"]')).toBeChecked();
        expect(two.querySelector('input[type="checkbox"]')).toBeChecked();
        expect(three.querySelector('input[type="checkbox"]')).toBeChecked();
        expect(four.querySelector('input[type="checkbox"]')).not.toBeChecked();
      })
    );
  });

  describe('Select Group', () => {
    let host: SpectatorWithHost<DatoSelectComponent, GroupComponent>;

    const createHost = createHostFactory(GroupComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options$ | async" #datoGroup>

        <dato-group *ngFor="let group of datoGroup.data">
          <div groupLabel>{{group.label}}</div>

          <dato-option *ngFor="let option of group.children" [option]="option">
            {{option.label}}
          </dato-option>

        </dato-group>

      </dato-select>
    `;

    it('should be define', () => {
      host = createHost(select);
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toBeDefined();
    });

    it(
      'should support groups',
      fakeAsync(() => {
        host = createHost(select);
        tick(501);
        host.click(TRIGGER_SINGLE_SELECTOR);
        host.detectChanges();
        const groups = queryAll(GROUP_SELECTOR);
        expect(groups.length).toEqual(3);
        expect(groups[0].querySelector('[groupLabel]')).toHaveText('Group A');
        expect(groups[0].querySelectorAll(OPTION_SELECTOR).length).toEqual(3);

        expect(groups[1].querySelector('[groupLabel]')).toHaveText('Group B');
        expect(groups[1].querySelectorAll(OPTION_SELECTOR).length).toEqual(1);

        expect(groups[2].querySelector('[groupLabel]')).toHaveText('Group C');
        expect(groups[2].querySelectorAll(OPTION_SELECTOR).length).toEqual(1);
      })
    );
  });

  describe('Disabled', () => {
    describe('Single', () => {
      let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

      const createHost = createHostFactory(CustomHostComponent);

      const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectDisabled [isCombo]="false">

        <dato-option *ngFor="let option of datoSelectDisabled.data" [option]="option">
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

      it('should toggle disabled/enable', () => {
        host = createHost(select);
        query(TRIGGER_SINGLE_SELECTOR).click();
        host.detectChanges();
        expect(query(DROPDOWN_SELECTOR)).not.toBeNull();
        query(TRIGGER_SINGLE_SELECTOR).click();
        host.detectChanges();
        expect(query(DROPDOWN_SELECTOR)).toBeNull();
        host.hostComponent.control.disable();
        host.detectChanges();
        query(SELECT_SELECTOR).click();
        expect(query(DROPDOWN_SELECTOR)).toBeNull();
        host.hostComponent.control.enable();
        query(TRIGGER_SINGLE_SELECTOR).click();
        host.detectChanges();
        expect(query(DROPDOWN_SELECTOR)).not.toBeNull();
      });

      it('should add the disable class', () => {
        host = createHost(select);
        host.hostComponent.control.disable();
        host.detectChanges();
        expect(host.query('.dato-select__trigger')).toHaveClass('dato-select--disabled');
      });
    });

    describe('Multi', () => {
      let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

      const createHost = createHostFactory(CustomHostComponent);

      const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectDisabled type="multi">

        <dato-option *ngFor="let option of datoSelectDisabled.data" [option]="option" multi>
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

      it('should toggle disabled/enable', () => {
        host = createHost(select);
        query(TRIGGER_MULTI_SELECTOR).click();
        host.detectChanges();
        expect(query(DROPDOWN_SELECTOR)).not.toBeNull();
        document.body.click();
        host.detectChanges();
        expect(query(DROPDOWN_SELECTOR)).toBeNull();
        host.hostComponent.control.disable();
        host.detectChanges();
        query(SELECT_SELECTOR).click();
        expect(query(DROPDOWN_SELECTOR)).toBeNull();
        host.hostComponent.control.enable();
        query(TRIGGER_MULTI_SELECTOR).click();
        host.detectChanges();
        expect(query(DROPDOWN_SELECTOR)).not.toBeNull();
      });

      it('should add the disable class', () => {
        host = createHost(select);
        host.hostComponent.control.disable();
        host.detectChanges();
        expect(host.query('.dato-select__trigger')).toHaveClass('dato-select--disabled');
      });
    });
  });

  describe('With Actions', () => {
    let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectFooter (save)="save()" type="multi">

        <dato-option *ngFor="let option of datoSelectFooter.data" [option]="option" multi>
          {{option.label}}
        </dato-option>

      </dato-select>
    `;

    it(
      'should show save and cancel buttons',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        flushMicrotasks();
        host.detectChanges();
        expect(query(`${DROPDOWN_SELECTOR} dato-link`)).toBeVisible();
        expect(query(`${DROPDOWN_SELECTOR} dato-button`)).toBeVisible();
      })
    );

    it(
      'should close when clicking cancel',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        tick();
        host.detectChanges();
        query(`${DROPDOWN_SELECTOR} dato-link`).click();
        tick(301);
        host.detectChanges();
        expect(DROPDOWN_SELECTOR).not.toBeVisible();
      })
    );

    it(
      'should emit save when clicking save',
      fakeAsync(() => {
        host = createHost(select);
        spyOn(host.hostComponent, 'save').and.callThrough();
        host.click(TRIGGER_MULTI_SELECTOR);
        tick();
        host.detectChanges();
        query(`${DROPDOWN_SELECTOR} dato-button`).click();
        tick(301);
        host.detectChanges();
        expect(host.hostComponent.save).toHaveBeenCalledTimes(1);
        expect(DROPDOWN_SELECTOR).not.toBeVisible();
      })
    );
  });

  describe('Custom Template', () => {
    let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectActiveTpl>

        <ng-container *datoActive="let active">
          <div class="d-flex items-center">
            <dato-icon datoIcon="pin" datoSize="md" width="15px" class="mr-5" datoColor="green-400"></dato-icon>
            {{active?.label}}
          </div>
        </ng-container>

        <dato-option *ngFor="let option of datoSelectActiveTpl.data" [option]="option">
          <div class="d-flex items-center">
            <dato-icon datoIcon="pin" datoSize="md" class="mr-5" width="15px"></dato-icon>
            {{option.label}}
          </div>
        </dato-option>

      </dato-select>
    `;

    it('should support custom option template', () => {
      host = createHost(select);
      host.click(TRIGGER_SINGLE_SELECTOR);
      expect(query(OPTION_SELECTOR).querySelector('.dato-icon-pin')).toBeVisible();
    });

    it('should support custom active template', () => {
      host = createHost(select);
      host.hostComponent.control.patchValue({ id: 1, label: 'Item 1' });
      host.detectChanges();
      expect(host.query(TRIGGER_SINGLE_SELECTOR).querySelector('.dato-icon-pin')).toBeVisible();
      expect(host.query(TRIGGER_SINGLE_SELECTOR)).toHaveText('Item 1');
    });
  });

  describe('Custom Footer', () => {
    let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectCustomFooter type="multi">

        <dato-option *ngFor="let option of datoSelectCustomFooter.data" [option]="option" multi>
          {{option.label}}
        </dato-option>

        <div datoSelectFooter>
          <dato-button (click)="datoSelectCustomFooter.close()">Content inside footer</dato-button>
        </div>

      </dato-select>
    `;

    it('should show custom footer', () => {
      host = createHost(select);
      host.click(TRIGGER_MULTI_SELECTOR);
      expect(query(`${DROPDOWN_SELECTOR} dato-button`)).toHaveText('Content inside footer');
    });
  });

  describe('Select All', () => {
    let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectCustomFooter type="multi" [allowSelectAll]="true">

        <dato-option *ngFor="let option of datoSelectCustomFooter.data" [option]="option" multi>
          {{option.label}}
        </dato-option>
        
      </dato-select>
    `;

    it(
      'should show select all option',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        flushMicrotasks();
        host.detectChanges();
        expect(query(`${DROPDOWN_SELECTOR} .dato-select__header`)).toBeVisible();
      })
    );

    it(
      'should select all',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        flushMicrotasks();
        host.detectChanges();
        query('.dato-select__header').click();
        host.detectChanges();
        expect(query(`${DROPDOWN_SELECTOR} .dato-select__header input[type="checkbox"]`)).toBeChecked();
        expect(host.hostComponent.control.value.length).toEqual(15);
        expect(host.queryAll('.dato-trigger-multi__active').length).toEqual(15);
        query('.dato-select__header').click();
        host.detectChanges();
        expect(host.hostComponent.control.value.length).toEqual(0);
        expect(query(`${DROPDOWN_SELECTOR} .dato-select__header input[type="checkbox"]`)).not.toBeChecked();
      })
    );

    it(
      'should unchecked the select all when one is not selected',
      fakeAsync(() => {
        host = createHost(select);
        host.click(TRIGGER_MULTI_SELECTOR);
        flushMicrotasks();
        host.detectChanges();
        query('.dato-select__header').click();
        host.detectChanges();
        expect(query(`${DROPDOWN_SELECTOR} .dato-select__header input[type="checkbox"]`)).toBeChecked();
        expect(query(`${DROPDOWN_SELECTOR} .dato-select__header`)).toHaveText('15/15');
        expect(host.hostComponent.control.value.length).toEqual(15);
        expect(host.queryAll('.dato-trigger-multi__active').length).toEqual(15);
        query(OPTION_SELECTOR).click();
        tick(11);
        host.detectChanges();
        expect(host.hostComponent.control.value.length).toEqual(14);
        expect(query(`${DROPDOWN_SELECTOR} .dato-select__header`)).toHaveText('14/15');
        expect(host.queryAll('.dato-trigger-multi__active').length).toEqual(14);
        expect(query(`${DROPDOWN_SELECTOR} .dato-select__header input[type="checkbox"]`)).not.toBeChecked();
      })
    );
  });

  describe('Sizes', () => {
    describe('Small', () => {
      let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;
      const createHost = createHostFactory(CustomHostComponent);

      const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectSearch3 datoSize="sm">
        <dato-option *ngFor="let option of datoSelectSearch3.data" [option]="option">
          {{option.label}}
        </dato-option>
      </dato-select>
    `;

      it('should be small', () => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        expect(query('.dato-overlay')).toHaveClass('dato-select-sm');
      });
    });

    describe('Medium', () => {
      let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;
      const createHost = createHostFactory(CustomHostComponent);

      const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectSearch3>
        <dato-option *ngFor="let option of datoSelectSearch3.data" [option]="option">
          {{option.label}}
        </dato-option>
      </dato-select>
    `;

      it('should be medium', () => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        expect(query('.dato-overlay')).toHaveClass('dato-select-md');
      });
    });

    describe('Large', () => {
      let host: SpectatorWithHost<DatoSelectComponent, CustomHostComponent>;
      const createHost = createHostFactory(CustomHostComponent);

      const select = `
      <dato-select [formControl]="control" [dataSet]="options" #datoSelectSearch3 datoSize="lg">
        <dato-option *ngFor="let option of datoSelectSearch3.data" [option]="option">
          {{option.label}}
        </dato-option>
      </dato-select>
    `;

      it('should be large', () => {
        host = createHost(select);
        host.click(TRIGGER_SINGLE_SELECTOR);
        expect(query('.dato-overlay')).toHaveClass('dato-select-lg');
      });
    });
  });
});

function getOptionsAsArray() {
  return [].slice.call(document.querySelectorAll(OPTION_SELECTOR));
}

function isOptionHidden(el) {
  return !!el.querySelector('.dato-select__option.force-hide');
}
