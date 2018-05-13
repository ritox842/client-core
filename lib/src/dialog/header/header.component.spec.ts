import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatoDialogHeaderComponent } from './header.component';

describe('ModalHeaderComponent', () => {
  let component: DatoDialogHeaderComponent;
  let fixture: ComponentFixture<DatoDialogHeaderComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DatoDialogHeaderComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatoDialogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
