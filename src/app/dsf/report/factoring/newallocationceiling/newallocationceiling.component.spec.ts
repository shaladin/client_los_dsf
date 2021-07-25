import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewallocationceilingComponent } from './newallocationceiling.component';

describe('NewallocationceilingComponent', () => {
  let component: NewallocationceilingComponent;
  let fixture: ComponentFixture<NewallocationceilingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewallocationceilingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewallocationceilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
