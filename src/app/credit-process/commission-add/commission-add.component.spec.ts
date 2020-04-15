import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionAddComponent } from './commission-add.component';

describe('CommissionAddComponent', () => {
  let component: CommissionAddComponent;
  let fixture: ComponentFixture<CommissionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
