import { createHost, EasyTestWithHost } from '../ngx-easy-test-master/src';
import { AccordionGroupComponent } from './accordion-group.component';
import { AccordionContentComponent } from '../accordion-content/accordion-content.component';
import { AccordionHeaderComponent } from '../accordion-header/accordion-header.component';
import { By } from '@angular/platform-browser';

describe('AccordionGroupComponent', () => {
  const testHeaderText = 'Header Test';
  const testContentText = 'Content Test';

  type Context = EasyTestWithHost<AccordionGroupComponent>;
  createHost(AccordionGroupComponent, undefined, {
    declarations: [AccordionContentComponent, AccordionHeaderComponent]
  });

  it('should be created in collapsed state, and expanded when isExpanded of its content element is set to true.', function(this: Context) {
    this.create(`<dato-accordion-group>
		<dato-accordion-header>
			<div class="header">${testHeaderText}</div>
		</dato-accordion-header>
		<dato-accordion-content>
			<div class="content">${testContentText}</div>
		</dato-accordion-content>
	</dato-accordion-group>`);
    expect(this.query('.header')).toContainText(testHeaderText);
    expect(this.testedComponent.content.isExpanded).toBeFalsy();
    expect(this.query('.content')).toBeNull();
    this.testedComponent.content.isExpanded = true;
    this.hostFixture.detectChanges();
    expect(this.query('.content')).toContainText(testContentText);
  });
});
