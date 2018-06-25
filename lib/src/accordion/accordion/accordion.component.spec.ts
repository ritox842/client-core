/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { DatoAccordionComponent } from './accordion.component';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoAccordionHeaderComponent } from '../accordion-header/accordion-header.component';
import { DatoAccordionContentComponent } from '../accordion-content/accordion-content.component';
import { DatoAccordionGroupComponent } from '../accordion-group/accordion-group.component';
import { Component, ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

const declarations = [DatoAccordionHeaderComponent, DatoAccordionContentComponent, DatoAccordionGroupComponent];
const accordion = {
  component: DatoAccordionComponent,
  declarations
};

const simpleAccordion = `
 <dato-accordion>
   <dato-accordion-group>
    <dato-accordion-header>
      <div class="header">Title 1</div>
    </dato-accordion-header>
    <dato-accordion-content>
      <div class="content">Lorem 1</div>
    </dato-accordion-content>
  </dato-accordion-group>
  <dato-accordion-group>
    <dato-accordion-header>
      <div class="header">Title 2</div>
    </dato-accordion-header>
    <dato-accordion-content>
      <div class="content">Lorem 2</div>
    </dato-accordion-content>
  </dato-accordion-group>
  </dato-accordion>
`;

describe('DatoAccordionComponent', () => {
  let host: SpectatorWithHost<DatoAccordionComponent>;

  const createHost = createHostComponentFactory<DatoAccordionComponent>(accordion);

  it('should exists', () => {
    host = createHost(` <dato-accordion></dato-accordion>`);
    expect(host.element).toBeDefined();
  });

  describe('Toggle', () => {
    it('should toggle the group', () => {
      host = createHost(simpleAccordion);
      const header = host.query<ElementRef>(DatoAccordionHeaderComponent, { read: ElementRef });
      host.click(header);
      expect(host.query('dato-accordion-content div')).toExist();
      host.click(header);
      expect(host.query('dato-accordion-content div')).not.toExist();
    });
  });

  describe('@Input() activeIds', () => {
    it('should not open any group when activeIds is empty', () => {
      host = createHost(simpleAccordion);
      const contents = host.queryAll<DatoAccordionContentComponent>(DatoAccordionContentComponent);
      expect(contents.every(c => c._expanded)).toBeFalsy();
    });

    it('should open the first group', () => {
      host = createHost(simpleAccordion, true, { activeIds: 0 });
      const contents = host.queryAll<DatoAccordionContentComponent>(DatoAccordionContentComponent);
      expect(contents[0]._expanded).toBeTruthy();
    });

    it('should open both', () => {
      host = createHost(simpleAccordion, true, { activeIds: [0, 1] });
      const contents = host.queryAll<DatoAccordionContentComponent>(DatoAccordionContentComponent);
      expect(contents.every(c => c._expanded)).toBeTruthy();
    });
  });

  describe('@Input() closeOthers', () => {
    it('should NOT close the others by default', () => {
      host = createHost(simpleAccordion);
      const headers = host.queryAll<ElementRef>(DatoAccordionHeaderComponent, { read: ElementRef });
      const contents = host.queryAll<DatoAccordionContentComponent>(DatoAccordionContentComponent);
      host.click(headers[0]);
      host.click(headers[1]);
      expect(contents[0]._expanded).toBeTruthy();
      expect(contents[1]._expanded).toBeTruthy();
    });

    it('should close the others', () => {
      host = createHost(simpleAccordion, true, { closeOthers: true });
      const headers = host.queryAll<ElementRef>(DatoAccordionHeaderComponent, { read: ElementRef });
      const contents = host.queryAll<DatoAccordionContentComponent>(DatoAccordionContentComponent);
      host.click(headers[0]);
      host.click(headers[1]);
      expect(contents[0]._expanded).toBeFalsy();
      expect(contents[1]._expanded).toBeTruthy();
    });

    it('should expand all', () => {
      host = createHost(simpleAccordion, true, { expandAll: true });
      const contents = host.queryAll<DatoAccordionContentComponent>(DatoAccordionContentComponent);
      expect(contents[0]._expanded).toBeTruthy();
      expect(contents[1]._expanded).toBeTruthy();
    });
  });
});

@Component({
  selector: 'custom-host',
  template: `
    <button (click)="addMore()">Add one</button>
  `
})
class CustomHostComponent {
  dynamic = [{ id: 1, title: 'one', text: 'text1' }, { id: 1, title: 'two', text: 'text2' }];

  addMore() {
    this.dynamic = [...this.dynamic, { id: 1, title: 'three', text: 'text3' }];
  }

  onToggle(event) {}
}

const dynamicAccordion = `
  <dato-accordion>
    <dato-accordion-group *ngFor="let group of dynamic; index as index" (toggle)="onToggle($event)">
      <dato-accordion-header>
        <div class="header">{{group.title}}</div>
      </dato-accordion-header>
      <dato-accordion-content>
        <div class="content">{{group.text}}</div>
      </dato-accordion-content>
    </dato-accordion-group>
  </dato-accordion>
`;

describe('DatoAccordionComponent - Dynamic Content', () => {
  let host: SpectatorWithHost<DatoAccordionComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory<DatoAccordionComponent, CustomHostComponent>({
    declarations,
    component: DatoAccordionComponent,
    host: CustomHostComponent
  });

  it('should work with *ngFor', () => {
    host = createHost(dynamicAccordion);
    const groups = host.queryAll<DatoAccordionGroupComponent>(DatoAccordionGroupComponent);
    expect(groups.length).toEqual(2);
  });

  it('should support future groups', () => {
    host = createHost(dynamicAccordion);
    host.hostComponent.addMore();
    host.detectChanges();
    const groups = host.queryAll<DatoAccordionGroupComponent>(DatoAccordionGroupComponent);
    expect(groups.length).toEqual(3);
  });

  it(
    'should toggle future groups',
    fakeAsync(() => {
      let lastHeader, lastContent;
      host = createHost(dynamicAccordion);
      host.hostComponent.addMore();
      host.detectChanges();
      lastHeader = host.queryLast(DatoAccordionHeaderComponent, { read: ElementRef });
      host.click(lastHeader);
      lastContent = host.queryLast(DatoAccordionContentComponent, { read: ElementRef });

      expect(lastContent.nativeElement).toHaveText('text3');
      host.click(lastHeader);
      tick();
      expect(lastContent.nativeElement).not.toHaveText('text3');
    })
  );

  it('should call @Output() toggle', () => {
    host = createHost(dynamicAccordion);
    spyOn(host.hostComponent, 'onToggle');
    const header = host.query<ElementRef>(DatoAccordionHeaderComponent, { read: ElementRef });
    host.click(header);
    expect(host.hostComponent.onToggle).toHaveBeenCalledWith({ expanded: true });
    host.click(header);
    expect(host.hostComponent.onToggle).toHaveBeenCalledWith({ expanded: false });
  });
});

@Component({
  template: ``
})
class CustomHostDisabledComponent {
  dynamic = [{ id: 1, title: 'one', text: 'text1', disabled: true }, { id: 1, title: 'two', text: 'text2', disabled: false }];
}

const dynamicAccordionDisabled = `
  <dato-accordion>
    <dato-accordion-group *ngFor="let group of dynamic; index as index" [disabled]="group.disabled">
      <dato-accordion-header>
        <div class="header">{{group.title}}</div>
      </dato-accordion-header>
      <dato-accordion-content>
        <div class="content">{{group.text}}</div>
      </dato-accordion-content>
    </dato-accordion-group>
  </dato-accordion>
`;

describe('DatoAccordionComponent - Disabled', () => {
  let host: SpectatorWithHost<DatoAccordionComponent, CustomHostDisabledComponent>;

  const createHost = createHostComponentFactory<DatoAccordionComponent, CustomHostDisabledComponent>({
    declarations,
    component: DatoAccordionComponent,
    host: CustomHostDisabledComponent
  });

  beforeEach(() => {
    host = createHost(dynamicAccordionDisabled);
  });

  it('should be disabled', () => {
    const groups = host.queryAll<DatoAccordionGroupComponent>(DatoAccordionGroupComponent);
    expect(groups[0]._disabled).toEqual(true);
    expect(groups[1]._disabled).toEqual(false);
  });

  it('should do anything on header click', () => {
    const groups = host.queryAll<DatoAccordionGroupComponent>(DatoAccordionGroupComponent);
    const header = host.query<ElementRef>(DatoAccordionHeaderComponent, { read: ElementRef });
    host.click(header);
    expect(groups[0].content._expanded).toEqual(false);
  });

  it('should NOT be disable', () => {
    host.hostComponent.dynamic[0].disabled = false;
    host.detectChanges();
    const groups = host.queryAll<DatoAccordionGroupComponent>(DatoAccordionGroupComponent);
    const header = host.query<ElementRef>(DatoAccordionHeaderComponent, { read: ElementRef });
    host.click(header);
    expect(groups[0].content._expanded).toEqual(true);
  });

  it('should add disable class to group', () => {
    const group = host.query<ElementRef>(DatoAccordionGroupComponent, { read: ElementRef });
    expect(group.nativeElement).toHaveClass('dato-accordion-disabled');
  });
});
