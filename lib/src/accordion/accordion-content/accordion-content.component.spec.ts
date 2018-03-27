// import {AccordionContentComponent} from './accordion-content.component';
// import {createHost, EasyTestWithHost} from '../ngx-easy-test-master/src';
//
// describe('AccordionContentComponent', () => {
//
//   type Context = EasyTestWithHost<AccordionContentComponent>;
//   createHost(AccordionContentComponent);
//
//   it('should not be expanded initially.', function (this: Context) {
//     const testText = 'Content Test';
//     this.create(`
// 	  <dato-accordion-content>
// 			<div class="content">${testText}</div>
// 		</dato-accordion-content>`);
//     expect(this.testedComponent.isExpanded).toBeFalsy();
//     expect(this.query('.content')).toBeNull();
//     this.whenInput('isExpanded', true);
//     expect(this.query('.content')).toContainText(testText);
//   });
// });
