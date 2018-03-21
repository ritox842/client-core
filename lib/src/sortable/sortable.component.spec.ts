import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SortableComponent } from './sortable.component';

describe('SortableComponent', () => {
  let component: SortableComponent;
  let fixture: ComponentFixture<SortableComponent>;

  beforeEach(async () => {
    const module = extendDefaultModule({
      imports: [],
      providers: [],
      declarations: [SortableComponent]
    });

    TestBed.configureTestingModule(module).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
