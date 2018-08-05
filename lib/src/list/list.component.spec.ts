import { createHostComponentFactory, query, queryAll, SpectatorWithHost, typeInElement } from '@netbasal/spectator';
import { DatoButtonModule, DatoInputModule, DatoTranslateService, IconRegistry } from '../..';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, Type } from '@angular/core';
import { stubs } from '../services/public_api';
import { fakeAsync, tick } from '@angular/core/testing';
import { DatoListComponent } from './list.component';
import { DatoOptionsModule } from '../options/options.module';
import { CommonModule } from '@angular/common';

const optionsData = [
  {
    label: 'A',
    children: [{ id: 1, label: 'abc' }, { id: 2, label: 'efg' }, { id: 3, label: 'hij' }]
  },
  {
    label: 'B',
    children: [{ id: 4, label: 'klm' }]
  },
  {
    label: 'C',
    children: [{ id: 5, label: 'nop' }]
  }
];

const flattenedOptionsData = [
  { id: 1, label: 'abc', group: 'A' },
  { id: 2, label: 'efg', group: 'A' },
  {
    id: 3,
    label: 'hij',
    group: 'A'
  },
  { id: 4, label: 'klm', group: 'B' },
  { id: 5, label: 'nop', group: 'C' }
];

const normalizedOptionsData = [
  {
    label: 'A',
    children: [
      { id: 1, label: 'abc', group: 'A' },
      { id: 2, label: 'efg', group: 'A' },
      {
        id: 3,
        label: 'hij',
        group: 'A'
      }
    ]
  },
  {
    label: 'B',
    children: [{ id: 4, label: 'klm', group: 'B' }]
  },
  {
    label: 'C',
    children: [{ id: 5, label: 'nop', group: 'C' }]
  }
];

const flatOptionsData = [{ id: 1, label: 'abc' }, { id: 2, label: 'efg' }, { id: 3, label: 'hij' }, { id: 4, label: 'klm' }, { id: 5, label: 'nop' }];

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  control = new FormControl();
  options: any[] = optionsData;
}

function createHostFactory<T>(host: Type<T>) {
  return createHostComponentFactory({
    component: DatoListComponent,
    host,
    declarations: [DatoListComponent],
    providers: [IconRegistry, DatoTranslateService, stubs.translate()],
    imports: [CommonModule, ReactiveFormsModule, DatoButtonModule, DatoInputModule, DatoOptionsModule]
  });
}

//
const OPTIONS_SELECTOR = '.dato-list__options';
const SEARCH_SELECTOR = '.dato-input';
const OPTION_SELECTOR = 'dato-option';

describe('DatoList', () => {
  describe('Simple List', () => {
    let host: SpectatorWithHost<DatoListComponent, CustomHostComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const list = `
              <dato-list [formControl]="control" [dataSet]="options" #datoList>

          <dato-group *ngFor="let group of datoList.data">
            <div groupLabel>{{group.label}}</div>

            <dato-option *ngFor="let option of group.children; index as index" [option]="option" multi>
              {{option.label}}
            </dato-option>

          </dato-group>

        </dato-list>
    `;

    const flatList = `
              <dato-list [formControl]="control" [dataSet]="options" #datoList>


            <dato-option *ngFor="let option of datoList.data; index as index" [option]="option" multi>
              {{option.label}}
            </dato-option>

        </dato-list>
    `;

    it('should be defined', () => {
      host = createHost(list);
      expect(host.query(OPTIONS_SELECTOR)).toBeDefined();
    });

    it(
      'should select an option',
      fakeAsync(() => {
        host = createHost(list);
        host.click(query(OPTION_SELECTOR));
        tick(11);
        expect(host.hostComponent.control.value[0]).toEqual({ id: 1, label: 'abc' });
      })
    );

    it(
      'should select multiple options',
      fakeAsync(() => {
        host = createHost(list);
        host.click(query(OPTION_SELECTOR));
        tick(11);
        host.click(queryAll(OPTION_SELECTOR)[3]);
        tick(11);
        expect(host.hostComponent.control.value.length).toEqual(2);
        expect(host.hostComponent.control.value[0]).toEqual({ id: 1, label: 'abc' }, { id: 4, label: 'klm' });
      })
    );

    it(
      'should filter by search term',
      fakeAsync(() => {
        host = createHost(list);
        host.click(query(SEARCH_SELECTOR));
        typeInElement('nop', query(SEARCH_SELECTOR));
        host.detectChanges();
        host.click(query('div'));
        tick(301);
        host.detectChanges();
        // expect(host.component.options.filter(datoOption => datoOption.disabled).length).toEqual(4);
        // expect(host.component.options.filter(datoOption => datoOption.hide).length).toEqual(4);
        expect(getOptionsAsArray().length).toEqual(1);
        typeInElement('', query(SEARCH_SELECTOR));
        host.detectChanges();
        tick(301);
        host.detectChanges();

        /** search cleared  */
        expect(getOptionsAsArray().length).toEqual(5);
      })
    );

    it(
      'should filter flat lists by search term',
      fakeAsync(() => {
        host = createHost(flatList);
        host.hostComponent.options = flatOptionsData;
        host.detectChanges();
        host.click(query(SEARCH_SELECTOR));
        typeInElement('nop', query(SEARCH_SELECTOR));
        host.detectChanges();
        host.click(query('div'));
        tick(301);
        host.detectChanges();
        expect(getOptionsAsArray().length).toEqual(1);
        typeInElement('', query(SEARCH_SELECTOR));
        host.detectChanges();
        tick(301);
        host.detectChanges();
        /** search cleared  */
        expect(getOptionsAsArray().length).toEqual(5);
      })
    );

    it('should normalize data when groupBy is set', () => {
      host = createHost(list);
      host.component.groupBy = 'group';
      host.hostComponent.options = flattenedOptionsData;
      host.detectChanges();
      expect(host.component.data).toEqual(normalizedOptionsData);
    });
  });
});

function getOptionsAsArray() {
  return [].slice.call(document.querySelectorAll(OPTION_SELECTOR));
}

function isOptionHidden(el) {
  return !!el.querySelector('.dato-select__option.force-hide');
}
