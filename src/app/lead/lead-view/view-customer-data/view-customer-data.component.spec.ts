import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerDataComponent } from './view-customer-data.component';

describe('ViewCustomerDataComponent', () => {
  let component: ViewCustomerDataComponent;
  let fixture: ComponentFixture<ViewCustomerDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
