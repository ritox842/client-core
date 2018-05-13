import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatoDialogFooterComponent } from './dialog-footer.component';

describe('ModalFooterComponent', () => {
  let component: DatoDialogFooterComponent;
  let fixture: ComponentFixture<DatoDialogFooterComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DatoDialogFooterComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatoDialogFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
