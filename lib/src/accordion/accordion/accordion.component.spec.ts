// import {createHost, EasyTestWithHost} from '../ngx-easy-test-master/src';
// import {AccordionContentComponent} from '../accordion-content/accordion-content.component';
// import {AccordionHeaderComponent} from '../accordion-header/accordion-header.component';
// import {AccordionComponent} from './accordion.component';
// import {AccordionGroupComponent} from '../accordion-group/accordion-group.component';
// import {By} from '@angular/platform-browser';
//
// describe('AccordionGroupComponent', () => {
//   const testHeaderText = 'Header Test';
//   const testContentText = 'Content Test';
//
//   type Context = EasyTestWithHost<AccordionComponent>;
//   createHost(AccordionComponent, undefined, {
//     declarations: [ AccordionGroupComponent, AccordionContentComponent, AccordionHeaderComponent ]
//   });
//
//   it('should be created with default input values.', function ( this: Context ) {
//     this.create(`<dato-accordion><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group></dato-accordion>`);
//     expect(this.testedComponent.collapseOthers).toBeFalsy();
//     expect(this.testedComponent.expandAll).not.toBeDefined();
//     expect(this.testedComponent.selectedIndex).toEqual(0);
//     const allGroupHeaders = this.tested.queryAll(By.directive(AccordionHeaderComponent));
//     allGroupHeaders.forEach(( groupHeader, index ) => {
//       if ( index ) {
//         expect(groupHeader.nativeElement).not.toHaveClass('expanded');
//       } else {
//         expect(groupHeader.nativeElement).toHaveClass('expanded');
//       }
//     });
//   });
//
//   it('should expand all accordion groups based on a true expandAll value.', function ( this: Context ) {
//     this.create(`<dato-accordion [expandAll]="true"><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group></dato-accordion>`);
//     const expandedGroups = this.tested.queryAll(By.css('.expanded'));
//     expect(expandedGroups.length).toEqual(5);
//   });
//
//
//   it('should expand all accordion groups when toggleAllExpanding is called.', function ( this: Context ) {
//     this.create(`<dato-accordion><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group></dato-accordion>`);
//     expect(this.tested.queryAll(By.css('.expanded')).length).toEqual(1);
//     this.testedComponent.toggleAllExpanding(true);
//     this.detectChanges();
//     expect(this.tested.queryAll(By.css('.expanded')).length).toEqual(3);
//     this.testedComponent.toggleAllExpanding(false);
//     this.detectChanges();
//     expect(this.tested.queryAll(By.css('.expanded')).length).toEqual(0);
//   });
//
//
//   it('should cause the expand and collapse events to be emitted as a result of clicking on group headers.', function ( this: Context ) {
//     this.create(`<dato-accordion><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group></dato-accordion>`);
//     const firstGroup = this.testedComponent.groups.first;
//     const firstHeader = this.tested.queryAll(By.directive(AccordionHeaderComponent))[ 0 ];
//     expect(firstHeader).toBeDefined();
//
//     spyOn(firstGroup.expand, 'emit').and.callThrough();
//     spyOn(firstGroup.collapse, 'emit').and.callThrough();
//
//     firstHeader.nativeElement.click();
//     this.detectChanges();
//
//     expect(firstGroup.collapse.emit).toHaveBeenCalled();
//
//     firstHeader.nativeElement.click();
//     this.detectChanges();
//
//     expect(firstGroup.expand.emit).toHaveBeenCalled()
//   });
//
//
//   it('should collapse other accordion groups if one is expanded, when collapseOthers is set to true.', function ( this: Context ) {
//     this.create(`<dato-accordion [collapseOthers]="true"><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group></dato-accordion>`);
//     const firstHeader = this.tested.queryAll(By.directive(AccordionHeaderComponent))[ 0 ];
//     this.trigger('click', firstHeader);
//     let expandedGroups = this.tested.queryAll(By.css('.expanded'));
//     expect(expandedGroups.length).toEqual(1);
//     const thirdHeader = this.tested.queryAll(By.directive(AccordionHeaderComponent))[ 2 ];
//     expect(thirdHeader).toBeDefined();
//     thirdHeader.triggerEventHandler('click', null);
//     expandedGroups = this.tested.queryAll(By.css('.expanded'));
//     expect(expandedGroups.length).toEqual(1);
//   });
//
//   it('should expand a group based on selectedIndex value.', function ( this: Context ) {
//     this.create(`<dato-accordion [selectedIndex]="2"><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group></dato-accordion>`);
//     const allGroupHeaders = this.tested.queryAll(By.directive(AccordionHeaderComponent));
//     const expandedGroupHeader = this.tested.query(By.css('.expanded'));
//     expect(allGroupHeaders.indexOf(expandedGroupHeader)).toEqual(2);
//   });
//
//   it('should be created with child accordion groups in collapsed state, ' +
//     'and they should also revert to collapsed when parent is collapsed.', function ( this: Context ) {
//     this.create(`<dato-accordion><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 			<dato-accordion>
//           <dato-accordion-group>
//         <dato-accordion-header>
//           <div class="child-header">${testHeaderText} Child</div>
//         </dato-accordion-header>
//         <dato-accordion-content>
//           <div class="child-content">${testContentText} Child </div>
//         </dato-accordion-content>
//       </dato-accordion-group>
//       </dato-accordion>
//       </dato-accordion-content>
// 	</dato-accordion-group><dato-accordion-group>
// 		<dato-accordion-header>
// 			<div class="header">${testHeaderText}</div>
// 		</dato-accordion-header>
// 		<dato-accordion-content>
// 			<div class="content">${testContentText}</div>
// 		</dato-accordion-content>
// 	</dato-accordion-group></dato-accordion>`);
//     let expandedGroups = this.tested.queryAll(By.css('.expanded'));
//     expect(expandedGroups.length).toEqual(1);
//
// // expand all groups in parent accordion
//     this.testedComponent.toggleAllExpanding(true);
//     this.detectChanges();
//     expandedGroups = this.tested.queryAll(By.css('.expanded'));
//     expect(expandedGroups.length).toEqual(2);
//
// // expand group in child accordion
//     const childAccordion = this.tested.query(By.directive(AccordionComponent));
//     const childAccordionHeader = childAccordion.query(By.directive(AccordionHeaderComponent));
//     expect(childAccordionHeader.nativeElement).not.toHaveClass('expanded');
//     childAccordionHeader.nativeElement.click();
//     this.detectChanges();
//     expect(childAccordionHeader.nativeElement).toHaveClass('expanded');
//
// // collapse all groups in parent accordion
//     this.testedComponent.toggleAllExpanding(false);
//     this.detectChanges();
//     expandedGroups = this.tested.queryAll(By.css('.expanded'));
//     expect(expandedGroups.length).toEqual(0);
//
// // expansd all groups in parent accordion, and check that child accordion group is still collpased
//     this.testedComponent.toggleAllExpanding(true);
//     this.detectChanges();
//     expandedGroups = this.tested.queryAll(By.css('.expanded'));
//     expect(expandedGroups.length).toEqual(2);
//   });
//
// });
