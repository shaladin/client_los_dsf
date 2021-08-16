import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionV2XComponent } from './commission-v2-x.component';

describe('CommissionV2XComponent', () => {
  let component: CommissionV2XComponent;
  let fixture: ComponentFixture<CommissionV2XComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionV2XComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionV2XComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
