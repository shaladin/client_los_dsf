import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMouCustomerDsfComponent } from './edit-mou-customer-dsf.component';

describe('EditMouCustomerDsfComponent', () => {
  let component: EditMouCustomerDsfComponent;
  let fixture: ComponentFixture<EditMouCustomerDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMouCustomerDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMouCustomerDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
