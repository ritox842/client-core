// import {AccordionHeaderComponent} from './accordion-header.component';
// import {createHost, EasyTestWithHost} from '../ngx-easy-test-master/src';
//
// describe('AccordionHeaderComponent', () => {
//
//   type Context = EasyTestWithHost<AccordionHeaderComponent>;
//   createHost(AccordionHeaderComponent);
//
//   it('should be created', function (this: Context) {
//     const testText = 'Header Test';
//     this.create(`	<dato-accordion-header>
// 			<div class="header">${testText}</div>
// 		</dato-accordion-header>`);
//     expect(this.query('.header')).toContainText(testText);
//   });
//
//   it('should add the expanded class when isExpanded is set to true.', function (this: Context) {
//     const testText = 'Header Test';
//     this.create(`	<dato-accordion-header>
// 			<div class="header">${testText}</div>
// 		</dato-accordion-header>`);
//     expect(this.tested.nativeElement).not.toHaveClass('expanded');
//     this.whenInput('isExpanded',true);
//     expect(this.tested.nativeElement).toHaveClass('expanded');
//   });
// });
