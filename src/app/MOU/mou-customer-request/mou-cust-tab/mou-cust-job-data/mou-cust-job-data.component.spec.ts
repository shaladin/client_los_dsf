import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouCustJobDataComponent } from './mou-cust-job-data.component';

describe('MouCustJobDataComponent', () => {
  let component: MouCustJobDataComponent;
  let fixture: ComponentFixture<MouCustJobDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouCustJobDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouCustJobDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
