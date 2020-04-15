import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionPagingComponent } from './commission-paging.component';

describe('CommissionPagingComponent', () => {
  let component: CommissionPagingComponent;
  let fixture: ComponentFixture<CommissionPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
